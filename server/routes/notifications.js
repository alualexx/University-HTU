const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) {
      filter.studentId = req.query.studentId; // Matching legacy schema or using ObjectId
    }
    
    // Support either studentId (legacy string) or toUser (ObjectId)
    const notifications = await Notification.find({
        $or: [
            { toUser: req.user.id },
            { studentId: req.user.id }
        ]
    }).sort("-timestamp");
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/notifications
// @desc    Create a notification
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put("/:id/read", protect, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
