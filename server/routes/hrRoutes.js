const express = require('express');
const router = express.Router();
const db = require('../database/db');
const eventBus = require('../events/eventBus');
const { santimToETB, etbToSantim, formatETB } = require('../utils/currency');
const { authenticate, authorize } = require('../middleware/auth');

// --- Employees ---
router.get('/employees', authenticate, (req, res) => {
  const { department_id, status, employment_type, ordination_status } = req.query;
  const employees = db.find('employees', e => {
    if (department_id && e.department_id !== department_id) return false;
    if (status && e.status !== status) return false;
    if (employment_type && e.employment_type !== employment_type) return false;
    if (ordination_status && e.ordination_status !== ordination_status) return false;
    return true;
  });

  const enriched = employees.map(e => {
    const dept = db.findById('departments', e.department_id);
    const pos = db.findById('positions', e.position_id);
    const contract = db.findOne('contracts', c => c.employee_id === e.id && c.status === 'active');
    return {
      ...e,
      name: `${e.first_name} ${e.last_name}`,
      department_name: dept ? dept.name : null,
      position_title: pos ? pos.title : null,
      is_faculty: pos ? pos.is_faculty : false,
      salary_etb: contract ? santimToETB(contract.base_salary) : null,
      salary_formatted: contract ? formatETB(contract.base_salary) : null
    };
  });

  res.json({ success: true, count: enriched.length, data: enriched });
});

router.post('/employees', authenticate, authorize(['admin', 'hr_director']), (req, res) => {
  const { first_name, last_name, amharic_name, date_of_birth, gender, phone, email, ordination_status, ordination_date, employment_type, department_id, position_id, base_salary_etb } = req.body;
  
  if (!first_name || !last_name || !employment_type || !department_id) {
    return res.status(400).json({ error: 'first_name, last_name, employment_type, and department_id required' });
  }

  const year = new Date().getFullYear();
  const count = db.find('employees').length + 1;
  const employee_id_number = `EMP-${year}-${String(count).padStart(6, '0')}`;

  const emp = db.insert('employees', {
    employee_id_number,
    first_name,
    last_name,
    amharic_name,
    date_of_birth: date_of_birth || '1990-01-01',
    gender: gender || 'male',
    nationality: 'Ethiopian',
    phone,
    email,
    ordination_status: ordination_status || 'not_ordained',
    ordination_date: ordination_date || null,
    hire_date: new Date().toISOString().split('T')[0],
    employment_type,
    department_id,
    position_id,
    status: 'active'
  });

  // Create active contract with Santim currency standard
  if (base_salary_etb) {
    const santim = etbToSantim(base_salary_etb);
    db.insert('contracts', {
      employee_id: emp.id,
      contract_type: employment_type,
      start_date: emp.hire_date,
      end_date: employment_type === 'permanent' ? null : '2027-08-31',
      base_salary: santim,
      terms: 'Standard HTTU employment contract under 45-day probation period.',
      signed_date: emp.hire_date,
      status: 'active'
    });
  }

  // Provision statutory leave balances for employee
  const annualLeaveType = db.findOne('leave_types', lt => lt.name === 'Annual Leave');
  if (annualLeaveType) {
    db.insert('leave_balances', {
      employee_id: emp.id,
      leave_type_id: annualLeaveType.id,
      fiscal_year: `${year}-${year + 1}`,
      total_days: 20,
      used_days: 0,
      remaining_days: 20
    });
  }

  // If ordained clergy, provision church service leave (30 days)
  if (ordination_status && ordination_status !== 'not_ordained') {
    const churchLeaveType = db.findOne('leave_types', lt => lt.name === 'Church Service Leave');
    if (churchLeaveType) {
      db.insert('leave_balances', {
        employee_id: emp.id,
        leave_type_id: churchLeaveType.id,
        fiscal_year: `${year}-${year + 1}`,
        total_days: 30,
        used_days: 0,
        remaining_days: 30
      });
    }
  }

  eventBus.publish('EmployeeHired', 'HR.Employee', emp.id, {
    employee_id: emp.id,
    employee_id_number: emp.employee_id_number,
    name: `${emp.first_name} ${emp.last_name}`,
    ordination_status: emp.ordination_status,
    department_id: emp.department_id
  });

  res.status(201).json({ success: true, data: emp });
});

// --- Org Chart ---
router.get('/org-chart', authenticate, (req, res) => {
  const president = db.findOne('users', u => u.role === 'president');
  const departments = db.find('departments').map(dept => {
    const head = dept.head_faculty_id ? db.findById('users', dept.head_faculty_id) : null;
    const staff = db.find('employees', e => e.department_id === dept.id).map(e => ({
      id: e.id,
      employee_id_number: e.employee_id_number,
      name: `${e.first_name} ${e.last_name}`,
      amharic_name: e.amharic_name,
      ordination_status: e.ordination_status
    }));
    return {
      department_id: dept.id,
      name: dept.name,
      name_amharic: dept.name_amharic,
      head: head ? { name: head.full_name, amharic_name: head.amharic_name } : null,
      staff_count: staff.length,
      staff
    };
  });

  res.json({
    success: true,
    university: "Ethiopia Holy Trinity Theology University",
    president: president ? { name: president.full_name, amharic_name: president.amharic_name } : null,
    departments
  });
});

// --- Leave Management ---
router.get('/leave-types', (req, res) => {
  const types = db.find('leave_types');
  res.json({ success: true, data: types });
});

router.get('/leave-requests', authenticate, (req, res) => {
  const { employee_id, status } = req.query;
  const requests = db.find('leave_requests', r => {
    if (employee_id && r.employee_id !== employee_id) return false;
    if (status && r.status !== status) return false;
    return true;
  });

  const enriched = requests.map(r => {
    const emp = db.findById('employees', r.employee_id);
    const lt = db.findById('leave_types', r.leave_type_id);
    return {
      ...r,
      employee_name: emp ? `${emp.first_name} ${emp.last_name}` : null,
      leave_type_name: lt ? lt.name : null,
      leave_type_amharic: lt ? lt.name_amharic : null
    };
  });

  res.json({ success: true, data: enriched });
});

router.post('/leave-requests', authenticate, (req, res) => {
  const { employee_id, leave_type_id, start_date, end_date, total_days, reason, substitute_employee_id } = req.body;
  if (!employee_id || !leave_type_id || !start_date || !end_date || !total_days) {
    return res.status(400).json({ error: 'All leave request fields are required' });
  }

  // Check balance
  const balance = db.findOne('leave_balances', b => b.employee_id === employee_id && b.leave_type_id === leave_type_id);
  if (balance && balance.remaining_days < Number(total_days)) {
    return res.status(400).json({ error: `Insufficient leave balance. Remaining days: ${balance.remaining_days}` });
  }

  const reqRecord = db.insert('leave_requests', {
    employee_id,
    leave_type_id,
    start_date,
    end_date,
    total_days: Number(total_days),
    reason,
    substitute_employee_id: substitute_employee_id || null,
    status: 'pending'
  });

  res.status(201).json({ success: true, message: 'Leave request submitted for supervisor approval', data: reqRecord });
});

router.put('/leave-requests/:id/approve', authenticate, authorize(['department_head', 'hr_director', 'admin']), (req, res) => {
  const reqRecord = db.findById('leave_requests', req.params.id);
  if (!reqRecord) return res.status(404).json({ error: 'Leave request not found' });

  const { action = 'approved', comments } = req.body;
  const updated = db.update('leave_requests', reqRecord.id, {
    status: action,
    approved_by: req.user.id,
    approved_at: new Date().toISOString(),
    comments: comments || null
  });

  // Deduct balance
  if (action === 'approved') {
    const balance = db.findOne('leave_balances', b => b.employee_id === reqRecord.employee_id && b.leave_type_id === reqRecord.leave_type_id);
    if (balance) {
      db.update('leave_balances', balance.id, {
        used_days: balance.used_days + reqRecord.total_days,
        remaining_days: balance.remaining_days - reqRecord.total_days
      });
    }
  }

  res.json({ success: true, message: `Leave request ${action}`, data: updated });
});

// --- Faculty Workload Tracking ---
router.get('/faculty-workload', authenticate, (req, res) => {
  const { semester_id } = req.query;
  const semId = semester_id || 'sem-fall-2026';

  const facultyMembers = db.find('employees', e => {
    const pos = db.findById('positions', e.position_id);
    return pos && pos.is_faculty;
  });

  const workloads = facultyMembers.map(fac => {
    // Calculate total credit hours taught
    const offerings = db.find('course_offerings', off => off.faculty_id === fac.user_id && off.semester_id === semId);
    let teachingHours = 0;
    for (const off of offerings) {
      const c = db.findById('courses', off.course_id);
      teachingHours += c ? c.credit_hours : 3;
    }

    const standardLoad = 12.0;
    const maxBeforeOverload = 15.0;
    const overloadHours = teachingHours > maxBeforeOverload ? teachingHours - maxBeforeOverload : 0;
    const totalLoad = teachingHours + 3.0; // including research/committee

    return {
      employee_id: fac.id,
      name: `${fac.first_name} ${fac.last_name}`,
      amharic_name: fac.amharic_name,
      ordination_status: fac.ordination_status,
      teaching_hours: teachingHours,
      overload_hours: overloadHours,
      total_load: totalLoad,
      status: overloadHours > 0 ? 'overloaded' : (teachingHours < 9 ? 'underloaded' : 'standard_load')
    };
  });

  res.json({ success: true, semester_id: semId, data: workloads });
});

module.exports = router;
