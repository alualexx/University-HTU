const mongoose = require("mongoose");

const researchProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    pi: {
      type: String,
      required: true, // Principal Investigator
    },
    grant: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Pending", "Paused"],
      default: "Active",
    },
    department: String,
    college: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResearchProject", researchProjectSchema);
