const express = require("express");
const SystemBroadcast = require("../models/SystemBroadcast");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/system-broadcasts
// @desc    Get all system broadcasts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const broadcasts = await SystemBroadcast.find({ active: true }).sort({ createdAt: -1 });
    res.json(broadcasts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/system-broadcasts
// @desc    Create a system broadcast (deactivating others)
// @access  Private (Admin)
router.post("/", protect, requireRole('admin'), async (req, res) => {
  try {
    // Deactivate all existing broadcasts
    await SystemBroadcast.updateMany({ active: true }, { active: false });
    
    const broadcast = await SystemBroadcast.create(req.body);
    res.status(201).json(broadcast);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
