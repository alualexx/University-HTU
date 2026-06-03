const express = require("express");
const router = express.Router();
const AcademicEvent = require("../models/AcademicEvent");
const { protect } = require("../middleware/auth");

// @route   GET /api/academic-events
// @desc    Get academic events (filtered by collegeId if provided)
// @access  Private
router.get("/", protect, async (req, res) => {
    try {
        const { collegeId } = req.query;
        const filter = collegeId ? { collegeId } : {};
        const events = await AcademicEvent.find(filter).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/academic-events
// @desc    Create a new academic event
// @access  Private
router.post("/", protect, async (req, res) => {
    try {
        const event = await AcademicEvent.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   PUT /api/academic-events/:id
// @desc    Update an academic event
// @access  Private
router.put("/:id", protect, async (req, res) => {
    try {
        const event = await AcademicEvent.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @route   DELETE /api/academic-events/:id
// @desc    Delete an academic event
// @access  Private
router.delete("/:id", protect, async (req, res) => {
    try {
        const event = await AcademicEvent.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json({ message: "Event removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
