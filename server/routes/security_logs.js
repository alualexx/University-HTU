const express = require("express");
const SecurityLog = require("../models/SecurityLog");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/security_logs
// @desc    Get all security logs
// @access  Private (Admin)
router.get("/", protect, requireRole('admin'), async (req, res) => {
  try {
    const logs = await SecurityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/security_logs
// @desc    Create a security log
// @access  Private (Admin)
router.post("/", protect, requireRole('admin'), async (req, res) => {
  try {
    const log = await SecurityLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
