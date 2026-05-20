const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "College name is required"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, "College code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    deanName: {
      type: String,
      required: [true, "Dean name is required"],
    },
    deanEmail: {
      type: String,
      required: [true, "Dean email is required"],
      lowercase: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#1e40af",
    },
    iconUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending_provisioning"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("College", collegeSchema);
