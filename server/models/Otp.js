const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  code: { type: String, required: true },
  type: { type: String, required: true },
  targetName: { type: String, required: true },
  targetId: { type: String },
  isUsed: { type: Boolean, default: false },
  createdBy: { type: String },
  createdById: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Otp', otpSchema);
