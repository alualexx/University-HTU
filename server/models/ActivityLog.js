const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  adminName: { type: String },
  adminEmail: { type: String },
  ipAddress: { type: String },
  color: { type: String, default: "#00f0ff" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
