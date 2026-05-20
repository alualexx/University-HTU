const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// @route   POST /api/applications/submit
// @desc    Submit a new student application
// @access  Public
router.post("/submit", async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      referenceId: application.referenceId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Registrar/Admin)
router.put("/:id/status", protect, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    let studentId = undefined;

    if (status === "final_approved") {
      // Generate ID: ALX-XXXX/YYYY
      const year = new Date().getFullYear();
      const count = await Application.countDocuments({ 
        status: { $in: ["final_approved", "enrolled"] } 
      });
      const seq = String(count + 1).padStart(4, "0");
      studentId = `ALX-${seq}/${year}`;
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        reviewNotes, 
        studentId,
        reviewedBy: req.user._id,
        reviewedAt: Date.now()
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Create Notification
    const notification = new Notification({
      toEmail: application.email,
      recipientName: application.name,
      title: status === "final_approved" ? "Application Accepted!" : "Application Update",
      message: status === "final_approved" 
        ? `Congratulations! Your application to ${application.intendedMajor} has been accepted. Your Student ID is ${studentId}.`
        : `Your application status has been updated to: ${status}. Notes: ${reviewNotes || 'None'}`,
      type: status === "final_approved" ? "success" : "info",
      status: status === "final_approved" ? "accepted" : "rejected",
      department: application.intendedMajor,
      studentId: studentId
    });
    await notification.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
