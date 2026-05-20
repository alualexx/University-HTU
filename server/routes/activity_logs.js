const express = require("express");
const ActivityLog = require("../models/ActivityLog");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/activity_logs
// @desc    Get all activity logs
// @access  Private (Admin)
router.get("/", protect, requireRole('admin'), async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/activity_logs
// @desc    Create an activity log
// @access  Private (Admin)
router.post("/", protect, requireRole('admin'), async (req, res) => {
  try {
    const log = await ActivityLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
