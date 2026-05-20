const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  ip: { type: String },
  user: { type: String },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" },
  classification: { type: String },
  resolution: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SecurityLog", securityLogSchema);
