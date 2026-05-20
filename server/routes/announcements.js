const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const { protect } = require("../middleware/auth");

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { department, college, targetAudience } = req.query;
    let query = {};
    if (department) query.department = department;
    if (college) query.college = college;
    if (targetAudience) query.targetAudience = targetAudience;

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, body, priority, targetAudience } = req.body;
    const announcement = await Announcement.create({
      title,
      body,
      priority,
      targetAudience,
      postedBy: req.user._id,
      postedByName: req.user.name,
      department: req.user.department,
      college: req.user.college,
    });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    // Only the poster or an admin can delete
    if (announcement.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin" && req.user.role !== "registrar") {
      return res.status(401).json({ message: "Not authorized" });
    }
    await announcement.deleteOne();
    res.json({ message: "Announcement removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
