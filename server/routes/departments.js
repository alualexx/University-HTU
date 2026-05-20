const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const { protect } = require("../middleware/auth");

// @route   GET /api/departments
// @desc    Get all departments
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Populate collegeId to get the college name/code if needed
    const departments = await Department.find().populate("collegeId", "name code").sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching departments." });
  }
});

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
