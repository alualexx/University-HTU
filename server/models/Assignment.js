const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String },
        deadline: { type: Date, required: true },
        maxMarks: { type: Number, default: 100 },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "Closed", "Draft"],
            default: "Active",
        },
        submissions: [
            {
                studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                fileUrl: String,
                submittedAt: { type: Date, default: Date.now },
                grade: String,
                feedback: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
