const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        students: [
            {
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                status: {
                    type: String,
                    enum: ["present", "absent", "late", "excused"],
                    default: "absent",
                },
            },
        ],
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        remarks: { type: String },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure uniqueness per course per day
attendanceSchema.index({ courseId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
