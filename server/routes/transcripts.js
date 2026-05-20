const express = require("express");
const Transcript = require("../models/Transcript");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/transcripts/me
// @desc    Get my transcript
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const transcript = await Transcript.findOne({ student: req.user.id });
    if (!transcript) return res.status(404).json({ message: "Transcript not found" });
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/transcripts/:studentId
// @desc    Get student transcript (Admin/Faculty)
// @access  Private
router.get("/:studentId", protect, async (req, res) => {
    try {
        const transcript = await Transcript.findOne({ student: req.params.studentId });
        if (!transcript) return res.status(404).json({ message: "Transcript not found" });
        res.json(transcript);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/transcripts
// @desc    Create/Update transcript
// @access  Private (Registrar)
router.post("/", protect, async (req, res) => {
    try {
        const { studentId, cumulativeGPA, termRecords } = req.body;
        let transcript = await Transcript.findOne({ student: studentId });
        
        if (transcript) {
            transcript.cumulativeGPA = cumulativeGPA;
            transcript.termRecords = termRecords;
            await transcript.save();
        } else {
            transcript = await Transcript.create({
                student: studentId,
                cumulativeGPA,
                termRecords
            });
        }
        res.json(transcript);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
