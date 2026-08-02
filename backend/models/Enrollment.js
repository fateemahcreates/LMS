const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT
    // ==========================================
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // COURSE
    // ==========================================
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // ==========================================
    // COURSE OWNER (Instructor)
    // Makes instructor dashboard much faster
    // ==========================================
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // PROGRESS
    // ==========================================
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // CURRENT MODULE
    // ==========================================
    currentModule: {
      type: String,
      default: "Introduction",
    },

    // ==========================================
    // FINAL SCORE
    // ==========================================
    finalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // ENROLLMENT STATUS
    // ==========================================
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

    // ==========================================
    // CERTIFICATE
    // ==========================================
    certificateApproved: {
      type: Boolean,
      default: false,
    },

    certificateNumber: {
      type: String,
      default: null,
    },

    // ==========================================
    // DATES
    // ==========================================
    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// Prevent duplicate enrollment
// ==========================================
enrollmentSchema.index(
  {
    student: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Enrollment",
  enrollmentSchema
);