const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Automatically set when the student is enrolled
    startDate: {
      type: Date,
      default: Date.now,
    },

    // Automatically calculated from the course duration
    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Enrolled",
        "In Progress",
        "Completed",
        "Withdrawn",
      ],
      default: "Enrolled",
    },

    certificateApproved: {
      type: Boolean,
      default: false,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema
);