const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestedAt: { type: Date, default: Date.now },
  processedBy: { type: String },
  processedAt: { type: Date }
});

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
