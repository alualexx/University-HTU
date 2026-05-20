const express = require("express");
const Course = require("../models/Course");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses (optionally filter by dept, etc.)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;

    const courses = await Course.find(filter).populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching courses." });
  }
});

// @route   GET /api/courses/my-courses
// @desc    Get courses enrolled in by current student
// @access  Private
router.get("/my-courses", protect, async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user.id }).populate(
      "instructor",
      "name email"
    );
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching enrolled courses." });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a course by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name email");
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// @route   POST /api/courses
// @desc    Create a new course (Admin/Faculty)
// @access  Private/Admin,Faculty
router.post("/", protect, requireRole("admin", "faculty", "registrar"), async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Course code already exists." });
    }
    res.status(500).json({ message: "Server error creating course." });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private/Admin,Faculty
router.put("/:id", protect, requireRole("admin", "faculty", "registrar"), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error updating course." });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private/Admin
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });
    res.json({ message: "Course removed." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting course." });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll a student in a course
// @access  Private
router.post("/:id/enroll", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });

    const studentId = req.body.studentId || req.user.id;

    if (course.enrolledStudents.includes(studentId)) {
      return res.status(400).json({ message: "Student already enrolled." });
    }
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ message: "Course is full." });
    }

    course.enrolledStudents.push(studentId);
    await course.save();
    res.json({ message: "Enrolled successfully.", course });
  } catch (error) {
    res.status(500).json({ message: "Server error during enrollment." });
  }
});

// @route   POST /api/courses/:id/drop
// @desc    Drop a student from a course
// @access  Private
router.post("/:id/drop", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });

    const studentId = req.body.studentId || req.user.id;
    course.enrolledStudents = course.enrolledStudents.filter(
      (id) => id.toString() !== studentId.toString()
    );
    await course.save();
    res.json({ message: "Dropped successfully.", course });
  } catch (error) {
    res.status(500).json({ message: "Server error dropping course." });
  }
});

module.exports = router;
