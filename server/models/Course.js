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
    instructorId: { type: String, default: "" },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    credits: { type: Number, default: 3 },
    instructorName: { type: String, default: "" },
    registrarDescription: { type: String, default: "" },
    tuitionFee: { type: Number, default: 0 },
    maxStudents: { type: Number, default: 40 },
    schedule: { type: String },
    room: { type: String },
    year: { type: Number, required: true, default: 1 },
    semester: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["pending_college_approval", "pending_registrar_approval", "active", "archived", "rejected", "draft"],
      default: "pending_registrar_approval",
    },
    // New fields
    prerequisites: [
      {
        courseCode: { type: String },
        courseName: { type: String },
      },
    ],
    syllabusUrl: { type: String, default: "" },
    syllabusFileName: { type: String, default: "" },
    examSchedule: {
      midterm: { type: Date },
      final: { type: Date },
      makeup: { type: Date },
    },
    degreeProgram: { type: String, default: "" },
    courseType: {
      type: String,
      enum: ["core", "elective", "lab", "seminar", "project"],
      default: "core",
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
