const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    // Announcement title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Announcement content
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Announcement category
    type: {
      type: String,
      enum: [
        "General",
        "Assignment",
        "Exam",
        "Holiday",
        "Course Update",
      ],
      default: "General",
    },

    // Target audience
    audience: {
      type: String,
      enum: ["Everyone", "Course"],
      default: "Everyone",
    },

    // Optional course (used only when audience = Course)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    // Pin announcement to the top
    isPinned: {
      type: Boolean,
      default: false,
    },

    // Active / Archived
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },

    // Optional expiry date
    expiresAt: {
      type: Date,
      default: null,
    },

    // Admin who created it
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

module.exports = mongoose.model(
  "Announcement",
  announcementSchema
);