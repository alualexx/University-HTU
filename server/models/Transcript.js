const mongoose = require("mongoose");

const TranscriptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cumulativeGPA: {
      type: Number,
      default: 0,
    },
    termRecords: [
      {
        term: String,
        courses: [
          {
            code: String,
            title: String,
            credits: Number,
            grade: String,
            status: String, // e.g. "Completed", "Dropped"
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transcript", TranscriptSchema);
