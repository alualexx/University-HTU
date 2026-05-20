const express = require("express");
const router = express.Router();
const College = require("../models/College");
const { protect } = require("../middleware/auth");

// @route   GET /api/colleges
// @desc    Get all colleges
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { deanEmail } = req.query;
    let query = {};
    if (deanEmail) query.deanEmail = deanEmail;
    
    const colleges = await College.find(query).sort({ name: 1 });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching colleges." });
  }
});

// @route   POST /api/colleges
// @desc    Create a new college
// @access  Private/Admin (and Registrar)
router.post("/", protect, async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
