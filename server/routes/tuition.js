const express = require("express");
const TuitionPayment = require("../models/TuitionPayment");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/tuition
// @desc    Get tuition payments
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) {
      filter.student = req.query.studentId;
    }
    
    const payments = await TuitionPayment.find(filter).sort("-createdAt");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tuition
// @desc    Create a tuition payment
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { studentId, studentName, courseIds, courseName, amount, status, semester } = req.body;
    
    const payment = await TuitionPayment.create({
      student: studentId,
      studentName,
      courseIds,
      courseName,
      amount,
      status,
      semester
    });
    
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
