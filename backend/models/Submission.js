const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    // Student who submitted
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // Optional link to an admin-created assignment
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      default: null,
    },

    // Student title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Student description
    description: {
      type: String,
      default: "",
    },

    // Uploaded file
    file: {
      type: String,
      required: true,
    },

    // Submission workflow
    status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Graded",
      ],
      default: "Pending",
    },

    // Admin grading
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