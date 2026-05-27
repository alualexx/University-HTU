const express = require("express");
const os = require("os");
const SystemSetting = require("../models/SystemSetting");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const Course = require("../models/Course");

const router = express.Router();

// Track request count per interval
let requestCount = 0;
let requestHistory = [];

// Middleware to count all API requests (attach to app-level in server.js,
// but we can approximate from this module with a simple increment trick)
const incrementRequests = () => { requestCount++; };

// Snapshot request counts every 60s to build a history
setInterval(() => {
  const now = new Date();
  requestHistory.push({
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    requests: requestCount
  });
  requestCount = 0;
  if (requestHistory.length > 30) requestHistory.shift();
}, 60000);

// @route   GET /api/system/health
// @desc    Return real server health metrics
// @access  Private (Admin)
router.get("/health", protect, async (req, res) => {
  try {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const loadAvg = os.loadavg(); // [1min, 5min, 15min] — 0 on Windows
    const cpus = os.cpus();
    const numCpus = cpus.length || 1;

    // Compute CPU % from load avg (Linux/Mac) or estimate from process (Windows)
    let cpuPercent = 0;
    if (loadAvg[0] > 0) {
      cpuPercent = Math.min(100, Math.round((loadAvg[0] / numCpus) * 100));
    } else {
      // Windows fallback: approximate from heap usage relative to heap total
      cpuPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 60);
    }

    const memPercent = Math.round((usedMem / totalMem) * 100);
    const uptimeSeconds = process.uptime();

    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const uptimeStr = days > 0 ? `${days}d ${hours}h` : `${hours}h`;

    // Real counts
    const [userCount, courseCount] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments()
    ]);

    res.json({
      cpu: cpuPercent,
      memory: memPercent,
      memoryUsedMB: Math.round(usedMem / 1024 / 1024),
      memoryTotalMB: Math.round(totalMem / 1024 / 1024),
      heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
      uptime: uptimeStr,
      uptimeSeconds,
      requests: requestHistory.length > 0 ? requestHistory[requestHistory.length - 1].requests : 0,
      requestHistory,
      userCount,
      courseCount,
      nodeVersion: process.version,
      platform: os.platform(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
