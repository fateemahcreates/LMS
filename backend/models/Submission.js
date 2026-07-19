const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    // Student
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Assignment being submitted
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    // Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Student's optional note
    description: {
      type: String,
      default: "",
    },

    // Uploaded answer
    file: {
      type: String,
      required: true,
    },

    // Submission status
    status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Graded",
      ],
      default: "Pending",
    },

    // Grade
    score: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    gradedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);