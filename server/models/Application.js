const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Legal name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    intendedMajor: {
      type: String, // Storing as string or ObjectId? Register context uses string name. Let's use string for now.
      required: [true, "Intended major is required"],
    },
    level: {
      type: String,
      default: "Year 1",
    },
    highSchoolName: {
      type: String,
      required: [true, "High school name is required"],
    },
    highSchoolGrades: {
      type: String,
      required: [true, "Grades/GPA is required"],
    },
    personalStatement: {
      type: String,
      required: [true, "Personal statement is required"],
      minlength: [50, "Statement must be at least 50 characters"],
    },
    documents: {
      type: Map,
      of: String, // Storing Base64 for simplicity in demo, should use S3/GridFS in prod
    },
    referenceId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_dept_review", "approved_by_dept", "rejected_by_dept", "final_approved", "rejected_by_registrar", "enrolled", "withdrawn"],
      default: "pending_dept_review",
    },
    ipAddress: {
      type: String,
    },
    reviewNotes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
