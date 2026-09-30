const express = require('express');
const router = express.Router();
const db = require('../database/db');
const eventBus = require('../events/eventBus');
const { santimToETB, etbToSantim, formatETB } = require('../utils/currency');
const { authenticate, authorize } = require('../middleware/auth');

// --- Catalog Items ---
router.get('/catalog', (req, res) => {
  const { type, language, is_rare, search } = req.query;
  const items = db.find('catalog_items', item => {
    if (type && item.item_type !== type) return false;
    if (language && item.language !== language) return false;
    if (is_rare !== undefined && String(item.is_rare) !== String(is_rare)) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.title.toLowerCase().includes(q) ||
             (item.title_amharic && item.title_amharic.includes(q)) ||
             (item.title_geez && item.title_geez.includes(q)) ||
             (item.call_number && item.call_number.toLowerCase().includes(q));
    }
    return true;
  });

  const enriched = items.map(item => {
    const copies = db.find('catalog_copies', c => c.catalog_item_id === item.id);
    return {
      ...item,
      copies_count: copies.length,
      price_formatted: item.price ? formatETB(item.price) : null
    };
  });

  res.json({ success: true, count: enriched.length, data: enriched });
});

router.get('/catalog/:id', (req, res) => {
  const item = db.findById('catalog_items', req.params.id);
  if (!item) return res.status(404).json({ error: 'Catalog item not found' });

  const copies = db.find('catalog_copies', c => c.catalog_item_id === item.id);
  res.json({
    success: true,
    data: {
      ...item,
      copies,
      price_formatted: item.price ? formatETB(item.price) : null
    }
  });
});

router.post('/catalog', authenticate, authorize(['librarian', 'admin']), (req, res) => {
  const { title, title_amharic, title_geez, item_type, isbn, language, description, is_rare, location_code, call_number, price_etb } = req.body;
  if (!title || !item_type) {
    return res.status(400).json({ error: 'title and item_type are required' });
  }

  const price_santim = price_etb ? etbToSantim(price_etb) : 0;
  const item = db.insert('catalog_items', {
    title,
    title_amharic,
    title_geez,
    isbn,
    item_type,
    language: language || 'Ge\'ez',
    description,
    is_rare: is_rare || false,
    location_code,
    call_number,
    total_copies: 1,
    available_copies: 1,
    price: price_santim,
    status: 'active'
  });

  // Automatically create 1 physical copy
  const copyBarcode = `HTTU-${item_type.toUpperCase().substring(0, 2)}-${Math.floor(1000 + Math.random() * 9000)}`;
  db.insert('catalog_copies', {
    catalog_item_id: item.id,
    copy_number: 1,
    barcode: copyBarcode,
    condition: 'new',
    location: is_rare ? 'special_collections' : 'main_library',
    status: 'available',
    notes: is_rare ? 'Special collections parchment codex. Non-circulating.' : 'Standard copy.'
  });

  eventBus.publish('ItemCataloged', 'Library.Catalog', item.id, {
    item_id: item.id,
    title: item.title,
    item_type: item.item_type,
    is_rare: item.is_rare
  });

  res.status(201).json({ success: true, data: item });
});

// --- Circulation: Checkout with Barcode ---
router.post('/loans/checkout', authenticate, authorize(['librarian', 'admin']), (req, res) => {
  const { barcode, member_id, due_date } = req.body;
  if (!barcode || !member_id) {
    return res.status(400).json({ error: 'barcode and member_id are required' });
  }

  const copy = db.findOne('catalog_copies', c => c.barcode === barcode);
  if (!copy) return res.status(404).json({ error: 'Barcode copy not found' });

  if (copy.status !== 'available') {
    return res.status(400).json({ error: `Item is not available for loan (status: ${copy.status})` });
  }

  const item = db.findById('catalog_items', copy.catalog_item_id);
  if (item && item.is_rare) {
    return res.status(403).json({ error: 'Special collection & rare manuscripts are strictly non-circulating. Reading room only under staff supervision.' });
  }

  const member = db.findById('library_members', member_id);
  if (!member || member.status !== 'active') {
    return res.status(400).json({ error: 'Library member is not active or suspended' });
  }

  // Active loans count check
  const activeLoans = db.find('loans', l => l.member_id === member.id && l.status === 'active');
  const priv = db.getBorrowingPrivilege(member.member_type);
  if (activeLoans.length >= priv.max_books) {
    return res.status(400).json({ error: `Member borrowing quota reached (Max ${priv.max_books} books allowed for ${member.member_type})` });
  }

  // Calculate default due date based on privileges
  const loanDays = priv.loan_days;
  const calculatedDueDate = new Date();
  calculatedDueDate.setDate(calculatedDueDate.getDate() + loanDays);
  const finalDueDate = due_date || calculatedDueDate.toISOString().split('T')[0];

  const loan = db.insert('loans', {
    copy_id: copy.id,
    member_id: member.id,
    checkout_date: new Date().toISOString().split('T')[0],
    due_date: finalDueDate,
    return_date: null,
    renewed_count: 0,
    status: 'active',
    checked_out_by: req.user.id
  });

  db.update('catalog_copies', copy.id, { status: 'checked_out' });
  if (item) {
    db.update('catalog_items', item.id, { available_copies: Math.max(0, item.available_copies - 1) });
  }

  eventBus.publish('ItemCheckedOut', 'Library.Loan', loan.id, {
    loan_id: loan.id,
    copy_id: copy.id,
    member_id: member.id,
    due_date: loan.due_date
  });

  res.status(201).json({ success: true, message: 'Item checked out successfully', data: loan });
});

// --- Circulation: Return with Barcode & Overdue Fine Calculation ---
router.post('/loans/return', authenticate, authorize(['librarian', 'admin']), (req, res) => {
  const { barcode } = req.body;
  if (!barcode) return res.status(400).json({ error: 'Barcode is required' });

  const copy = db.findOne('catalog_copies', c => c.barcode === barcode);
  if (!copy) return res.status(404).json({ error: 'Barcode copy not found' });

  const loan = db.findOne('loans', l => l.copy_id === copy.id && l.status === 'active');
  if (!loan) return res.status(400).json({ error: 'No active loan found for this barcode' });

  const now = new Date();
  const returnDate = now.toISOString().split('T')[0];
  const dueDate = new Date(loan.due_date);

  let fineRecord = null;
  if (now > dueDate) {
    const diffTime = Math.abs(now - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Regular item: 2 ETB (200 santim) per day; Reserve item: 5 ETB (500 santim) per day
    const isReserve = copy.location === 'reserve';
    const ratePerDay = isReserve ? 500 : 200;
    const fineAmountSantim = diffDays * ratePerDay;

    fineRecord = db.insert('fines', {
      loan_id: loan.id,
      member_id: loan.member_id,
      fine_type: 'overdue',
      amount: fineAmountSantim,
      paid_amount: 0,
      balance: fineAmountSantim,
      status: 'pending',
      created_at: now.toISOString()
    });

    eventBus.publish('ItemOverdue', 'Library.Fine', fineRecord.id, {
      loan_id: loan.id,
      member_id: loan.member_id,
      amount: fineAmountSantim,
      days_overdue: diffDays
    });
  }

  db.update('loans', loan.id, {
    return_date: returnDate,
    status: 'returned',
    returned_to: req.user.id
  });

  db.update('catalog_copies', copy.id, { status: 'available' });
  const item = db.findById('catalog_items', copy.catalog_item_id);
  if (item) {
    db.update('catalog_items', item.id, { available_copies: item.available_copies + 1 });
  }

  res.json({
    success: true,
    message: 'Item returned successfully',
    fine_generated: fineRecord ? {
      amount_etb: santimToETB(fineRecord.amount),
      amount_formatted: formatETB(fineRecord.amount),
      status: fineRecord.status
    } : null
  });
});

// --- IIIF Manuscript Manifest Endpoint ---
router.get('/digital/:id/manifest', (req, res) => {
  const item = db.findById('catalog_items', req.params.id);
  if (!item) return res.status(404).json({ error: 'Manuscript not found' });

  // IIIF Presentation API 3.0 format compliant
  const iiifManifest = {
    "@context": "http://iiif.io/api/presentation/3/context.json",
    "id": `https://manifests.httu.edu.et/manuscripts/${item.id}`,
    "type": "Manifest",
    "label": { "en": [item.title], "gez": [item.title_geez || item.title] },
    "metadata": [
      { "label": { "en": ["Language"] }, "value": { "en": [item.language] } },
      { "label": { "en": ["Preservation Status"] }, "value": { "en": [item.preservation_status || "Preserved"] } },
      { "label": { "en": ["Institution"] }, "value": { "en": ["Holy Trinity Theology University Archives"] } }
    ],
    "items": [
      {
        "id": `https://manifests.httu.edu.et/canvas/1`,
        "type": "Canvas",
        "height": 3000,
        "width": 2000,
        "items": [
          {
            "id": `https://manifests.httu.edu.et/annotation/1`,
            "type": "AnnotationPage",
            "items": [
              {
                "id": `https://manifests.httu.edu.et/image/1`,
                "type": "Annotation",
                "motivation": "painting",
                "body": {
                  "id": item.cover_image_url,
                  "type": "Image",
                  "format": "image/jpeg"
                },
                "target": `https://manifests.httu.edu.et/canvas/1`
              }
            ]
          }
        ]
      }
    ]
  };

  res.json(iiifManifest);
});

// --- Fines ---
router.get('/fines', authenticate, (req, res) => {
  const { member_id, status } = req.query;
  const fines = db.find('fines', f => {
    if (member_id && f.member_id !== member_id) return false;
    if (status && f.status !== status) return false;
    return true;
  });

  const enriched = fines.map(f => ({
    ...f,
    amount_etb: santimToETB(f.amount),
    amount_formatted: formatETB(f.amount),
    balance_etb: santimToETB(f.balance),
    balance_formatted: formatETB(f.balance)
  }));

  res.json({ success: true, data: enriched });
});

router.post('/fines/:id/waive', authenticate, authorize(['librarian', 'admin']), (req, res) => {
  const fine = db.findById('fines', req.params.id);
  if (!fine) return res.status(404).json({ error: 'Fine record not found' });

  const { waived_reason } = req.body;
  const updated = db.update('fines', fine.id, {
    status: 'waived',
    balance: 0,
    waived_by: req.user.id,
    waived_reason: waived_reason || 'Approved administrative waiver'
  });

  res.json({ success: true, message: 'Fine waived with supervisor approval', data: updated });
});

module.exports = router;
