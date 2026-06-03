const express = require("express");
const router = express.Router();
const College = require("../models/College");
const Department = require("../models/Department");
const User = require("../models/User");
const ResearchProject = require("../models/ResearchProject");
const Transcript = require("../models/Transcript");
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

// @route   GET /api/colleges/:id/metrics
// @desc    Get college-wide metrics for Dean's dashboard
// @access  Private
router.get("/:id/metrics", protect, async (req, res) => {
  try {
    const collegeId = req.params.id;
    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ message: "College not found" });

    const departments = await Department.find({ collegeId });
    const deptNames = departments.map(d => d.name);

    const students = await User.find({ role: "student", department: { $in: deptNames } });
    const studentIds = students.map(s => s._id);

    const [studentCount, facultyCount, researchCount, transcripts] = await Promise.all([
      User.countDocuments({ role: "student", department: { $in: deptNames } }),
      User.countDocuments({ role: "teacher", department: { $in: deptNames } }),
      ResearchProject.countDocuments({ collegeId }),
      Transcript.find({ student: { $in: studentIds } })
    ]);

    // Aggregate GPA Distribution
    const gpaDist = [
      { name: 'GPA 3.5-4.0', value: transcripts.filter(t => t.cumulativeGPA >= 3.5).length },
      { name: 'GPA 3.0-3.5', value: transcripts.filter(t => t.cumulativeGPA >= 3.0 && t.cumulativeGPA < 3.5).length },
      { name: 'GPA 2.5-3.0', value: transcripts.filter(t => t.cumulativeGPA >= 2.5 && t.cumulativeGPA < 3.0).length },
      { name: 'GPA < 2.5', value: transcripts.filter(t => t.cumulativeGPA < 2.5).length },
    ];

    // Mock completion rates for now
    const completionRate = [
      { name: 'Freshman', val: 85 },
      { name: 'Sophomore', val: 78 },
      { name: 'Junior', val: 92 },
      { name: 'Senior', val: 95 },
    ];

    res.json({
      studentCount,
      facultyCount,
      researchCount,
      gpaDistribution: gpaDist,
      completionRate,
      researchRate: studentCount > 0 ? ((researchCount / studentCount) * 100).toFixed(1) + "%" : "0%"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
