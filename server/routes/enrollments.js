const express = require("express");
const Enrollment = require("../models/Enrollment");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/enrollments
// @desc    Get all enrollments or filter by student
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) {
      filter.student = req.query.studentId;
    }
    
    // If not admin/registrar, only allow viewing own enrollments (simple check)
    if (req.user.role === 'student' && req.query.studentId && req.query.studentId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to view these enrollments" });
    }

    const enrollments = await Enrollment.find(filter).sort("-createdAt");
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/enrollments
// @desc    Create a new enrollment
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { studentId, studentName, courseId, courseName, status, paymentId, semester } = req.body;
    
    const enrollment = await Enrollment.create({
      student: studentId,
      studentName,
      course: courseId,
      courseName,
      status,
      paymentId: paymentId || null,
      semester
    });
    
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/enrollments/:id
// @desc    Update enrollment status or grade
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
