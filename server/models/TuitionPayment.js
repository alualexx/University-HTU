const mongoose = require("mongoose");

const TuitionPaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: String,
    courseIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }],
    courseName: String,
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "pending_approval", "approved", "rejected"],
      default: "pending",
    },
    semester: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TuitionPayment", TuitionPaymentSchema);
