const express = require('express');
const router = express.Router();
const Otp = require('../models/Otp');

// GET all OTPs
router.get('/', async (req, res) => {
  try {
    const otps = await Otp.find().sort({ createdAt: -1 });
    // Transform _id to id for the frontend
    const formatted = otps.map(otp => ({
      id: otp._id,
      ...otp.toObject(),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create OTP
router.post('/', async (req, res) => {
  const otp = new Otp(req.body);
  try {
    const newOtp = await otp.save();
    res.status(201).json({ id: newOtp._id, ...newOtp.toObject() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH toggle isUsed
router.patch('/:id', async (req, res) => {
  try {
    const otp = await Otp.findById(req.params.id);
    if (!otp) return res.status(404).json({ message: 'OTP not found' });
    
    if (req.body.isUsed !== undefined) {
      otp.isUsed = req.body.isUsed;
    }
    
    const updatedOtp = await otp.save();
    res.json({ id: updatedOtp._id, ...updatedOtp.toObject() });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE OTP
router.delete('/:id', async (req, res) => {
  try {
    const otp = await Otp.findById(req.params.id);
    if (!otp) return res.status(404).json({ message: 'OTP not found' });
    
    await otp.deleteOne();
    res.json({ message: 'OTP deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
