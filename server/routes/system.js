const express = require("express");
const SystemSetting = require("../models/SystemSetting");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/system/:key
// @desc    Get system settings by key
// @access  Public (or semi-private)
router.get("/:key", async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: req.params.key });
    if (!setting) {
        // Return default settings if none found to avoid dashboard errors
        if (req.params.key === 'registrar') {
            return res.json({
                settings: {
                    registrationLock: false,
                    admissionWindow: true,
                    targetYear: 1,
                    targetSemester: 1
                }
            });
        }
        if (req.params.key === 'settings') {
            return res.json({
                settings: {
                    maintenanceMode: false
                }
            });
        }
        return res.status(404).json({ message: "Setting not found" });
    }
    res.json(setting.settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/system/:key
// @desc    Update system settings
// @access  Private (Admin/Registrar)
router.post("/:key", protect, async (req, res) => {
  try {
    let setting = await SystemSetting.findOne({ key: req.params.key });
    if (setting) {
      setting.settings = { ...setting.settings, ...req.body };
      await setting.save();
    } else {
      setting = await SystemSetting.create({
        key: req.params.key,
        settings: req.body
      });
    }
    res.json(setting.settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
