const mongoose = require("mongoose");

const systemBroadcastSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ["info", "warning", "error"], default: "info" },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SystemBroadcast", systemBroadcastSchema);
