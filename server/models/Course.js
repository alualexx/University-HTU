const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Course code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    description: { type: String, default: "" },
    units: { type: Number, required: true, default: 3 },
    department: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxStudents: { type: Number, default: 40 },
    schedule: { type: String }, // e.g., "MWF 9:00-10:00 AM"
    room: { type: String },
    semester: { type: String }, // e.g., "1st Sem 2024-2025"
    status: {
      type: String,
      enum: ["active", "closed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
