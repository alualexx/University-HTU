const express = require("express");
const Schedule = require("../models/Schedule");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/schedules
// @desc    Get schedules
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const schedules = await Schedule.find().sort("day startTime");
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/schedules
// @desc    Create a schedule
// @access  Private
router.post("/", protect, async (req, res) => {
    try {
        const schedule = await Schedule.create(req.body);
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
