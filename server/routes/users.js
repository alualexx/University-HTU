const express = require("express");
const User = require("../models/User");
const { protect, requireRole } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/", protect, requireRole("admin", "registrar"), async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;
    
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users." });
  }
});

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching profile." });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user's profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, department, position } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, department, position },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile." });
  }
});

// @route   GET /api/users/:id
// @desc    Get a user by ID
// @access  Private/Admin
router.get("/:id", protect, requireRole("admin", "registrar"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// @route   POST /api/users
// @desc    Create a new user (Admin only)
// @access  Private/Admin
router.post("/", protect, requireRole("admin"), async (req, res) => {
  const { name, email, password, role, studentId, employeeId, department, year, requiresPasswordChange, tempPassword, college } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const userData = { name, email, role, studentId, employeeId, department, year, college, requiresPasswordChange: requiresPasswordChange ?? true };
    if (tempPassword) {
      userData.tempPassword = tempPassword;
      userData.password = tempPassword; // bcrypt will hash it
    } else {
      userData.password = password || "changeme"; // Default, user must change
    }

    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error creating user." });
  }
});

// @route   PUT /api/users/:id
// @desc    Update a user (Admin only)
// @access  Private/Admin
router.put("/:id", protect, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error updating user." });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, requireRole("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "User removed." });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user." });
  }
});

module.exports = router;
