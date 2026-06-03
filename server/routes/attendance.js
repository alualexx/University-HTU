const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");

// @route   POST /api/attendance
// @desc    Log or update attendance for a course on a specific date
router.post("/", async (req, res) => {
    try {
        const { courseId, students, date, markedBy, remarks } = req.body;

        // Normalize date to start of day for uniqueness check
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        // Find and update or create new record
        const attendance = await Attendance.findOneAndUpdate(
            { courseId, date: normalizedDate },
            { courseId, students, date: normalizedDate, markedBy, remarks },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Attendance for this date already exists." });
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/attendance
// @desc    Get attendance for a course
router.get("/", async (req, res) => {
    try {
        const { courseId, date } = req.query;
        let query = { courseId };

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const attendance = await Attendance.find(query)
            .populate("students.studentId", "name email studentId")
            .populate("markedBy", "name")
            .sort({ date: -1 });

        res.json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance history for a student
router.get("/student/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;
        const records = await Attendance.find({ "students.studentId": studentId })
            .populate("courseId", "name code")
            .sort({ date: -1 });

        res.json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
