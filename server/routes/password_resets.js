const express = require("express");
const PasswordReset = require("../models/PasswordReset");
const User = require("../models/User");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/password-resets
// @desc    Get all password reset requests
// @access  Private (Admin)
router.get("/", protect, requireRole('admin'), async (req, res) => {
  try {
    const resets = await PasswordReset.find().sort({ requestedAt: -1 });
    res.json(resets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/password-resets
// @desc    Request a password reset (Public)
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const reset = await PasswordReset.create({
      email,
      name: user ? user.name : "Unknown User",
      status: "pending"
    });
    res.status(201).json(reset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PATCH /api/password-resets/:id
// @desc    Update status of reset request
// @access  Private (Admin)
router.patch("/:id", protect, requireRole('admin'), async (req, res) => {
  try {
    const reset = await PasswordReset.findByIdAndUpdate(
      req.params.id,
      { ...req.body, processedAt: Date.now() },
      { new: true }
    );
    res.json(reset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
