const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: [true, "Parent college is required"],
    },
    headName: {
      type: String,
      required: [true, "Head of department name is required"],
    },
    headEmail: {
      type: String,
      required: [true, "Head of department email is required"],
      lowercase: true,
      trim: true,
    },
    duration: {
      type: String,
      default: "4 Years",
    },
    seats: {
      type: Number,
      default: 100,
    },
    requirements: {
      type: String,
      required: [true, "Academic requirements are required"],
    },
    requiredDocuments: {
      type: [String],
      default: ["Transcript", "ID/Passport", "Photo"],
    },
    color: {
      type: String,
      default: "#1976d2",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    admissionOpen: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending_credentials"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching by name within a college
departmentSchema.index({ name: 1, collegeId: 1 }, { unique: true });

module.exports = mongoose.model("Department", departmentSchema);
