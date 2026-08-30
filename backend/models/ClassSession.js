const mongoose = require("mongoose");

const classSessionSchema = new mongoose.Schema(
  {
    // ==========================================
    // COURSE
    // ==========================================
    // The course this class session belongs to.
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // ==========================================
    // INSTRUCTOR
    // ==========================================
    // The instructor responsible for this session.
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // SESSION DATE
    // ==========================================
    date: {
      type: Date,
      required: true,
    },

    // ==========================================
    // START TIME
    // ==========================================
    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // END TIME
    // ==========================================
    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // SESSION STATUS
    // ==========================================
    status: {
      type: String,
      enum: [
        "Scheduled",
        "Open",
        "Finalized",
        "Cancelled",
      ],
      default: "Scheduled",
    },

    // ==========================================
    // CREATED BY
    // ==========================================
    // Records the user who created the session.
    // This could be an Admin or the Instructor.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // NOTES
    // ==========================================
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// PREVENT DUPLICATE SESSION
// ==========================================
// A course should not have two sessions with
// the exact same date and start time.
classSessionSchema.index(
  {
    course: 1,
    date: 1,
    startTime: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "ClassSession",
  classSessionSchema
);