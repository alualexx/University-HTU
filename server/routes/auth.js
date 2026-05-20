const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Helper: generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select("+password +tempPassword");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.disabled) {
      return res.status(403).json({ message: "Account has been disabled. Contact an administrator." });
    }

    // Check temp password bypass
    if (user.tempPassword && user.tempPassword === password) {
      const token = generateToken(user._id);
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          requiresPasswordChange: true,
          department: user.department,
          college: user.college,
          studentId: user.studentId,
          employeeId: user.employeeId,
        },
      });
    }

    // Check hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requiresPasswordChange: user.requiresPasswordChange,
        department: user.department,
        college: user.college,
        studentId: user.studentId,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (public sign-up)
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password, role, studentId, employeeId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      studentId,
      employeeId,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// @route   PUT /api/auth/change-password
// @desc    Change current user's password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const user = await User.findById(req.user.id).select("+password");
    user.password = newPassword;
    user.requiresPasswordChange = false;
    user.tempPassword = undefined;
    user.lastPasswordUpdate = new Date();
    await user.save();
    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error changing password." });
  }
});

// @route   POST /api/auth/request-reset
// @desc    Request a password reset (admin will handle it)
// @access  Public
router.post("/request-reset", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required." });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }
    // In a real system you'd send an email or create a reset token here.
    // For now we just confirm the user exists.
    res.json({ message: "Reset request received. An administrator will process it shortly." });
  } catch (error) {
    res.status(500).json({ message: "Server error processing reset request." });
  }
});

module.exports = router;

