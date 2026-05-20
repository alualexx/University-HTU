const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseName: String,
    day: {
      type: String,
      required: true,
    },
    startTime: String,
    endTime: String,
    room: String,
    semester: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Schedule", ScheduleSchema);
