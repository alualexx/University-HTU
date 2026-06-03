const mongoose = require("mongoose");

const academicEventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, "Event date is required"],
        },
        type: {
            type: String,
            enum: ["Academic", "Research", "Administrative", "Event"],
            default: "Academic",
        },
        collegeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
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

module.exports = mongoose.model("AcademicEvent", academicEventSchema);
