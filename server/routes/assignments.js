const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

// @route   POST /api/assignments
// @desc    Create a new assignment
router.post("/", async (req, res) => {
    try {
        const assignment = new Assignment(req.body);
        await assignment.save();
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/assignments
// @desc    Get assignments for a course or instructor
router.get("/", async (req, res) => {
    try {
        const { courseId, createdBy } = req.query;
        let query = {};
        if (courseId) query.courseId = courseId;
        if (createdBy) query.createdBy = createdBy;

        const assignments = await Assignment.find(query)
            .populate("courseId", "name code")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/assignments/:id/grade
// @desc    Grade a submission
router.post("/:id/grade", async (req, res) => {
    try {
        const { studentId, grade, feedback } = req.body;
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

        const submission = assignment.submissions.find(s => s.studentId.toString() === studentId);
        if (submission) {
            submission.grade = grade;
            submission.feedback = feedback;
        } else {
            assignment.submissions.push({ studentId, grade, feedback });
        }

        await assignment.save();
        res.json({ success: true, data: assignment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
