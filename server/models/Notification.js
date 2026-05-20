const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  toEmail: String,
  recipientName: String,
  title: String,
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["info", "success", "warning", "error"],
    default: "info",
  },
  status: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
  },
  department: String,
  studentId: String,
  read: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
