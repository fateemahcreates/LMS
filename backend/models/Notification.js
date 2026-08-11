const mongoose = require("mongoose");

// ============================================================
// NOTIFICATION SCHEMA
// ============================================================

const notificationSchema = new mongoose.Schema(
  {
    // ========================================================
    // USER WHO RECEIVES THE NOTIFICATION
    // ========================================================

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ========================================================
    // NOTIFICATION TYPE
    // ========================================================

    type: {
      type: String,
      enum: [
        "announcement",
        "assignment",
        "submission",
        "grade",
        "course",
        "enrollment",
        "certificate",
        "system",
        "account",
      ],
      required: true,
      index: true,
    },

    // ========================================================
    // NOTIFICATION TITLE
    // ========================================================

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // ========================================================
    // NOTIFICATION MESSAGE
    // ========================================================

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // ========================================================
    // OPTIONAL LINK
    // ========================================================
    // Where the user should be taken when they click
    // the notification in the portal.

    link: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================================================
    // RELATED RESOURCE
    // ========================================================
    // Allows us to associate a notification with a course,
    // assignment, announcement, certificate, etc.

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    relatedModel: {
      type: String,
      enum: [
        "Announcement",
        "Assignment",
        "Submission",
        "Course",
        "Enrollment",
        "Certificate",
        "User",
        null,
      ],
      default: null,
    },

    // ========================================================
    // READ STATUS
    // ========================================================

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // ========================================================
    // EMAIL STATUS
    // ========================================================
    // Tracks whether an email notification was sent.
    //
    // This is separate from isRead because:
    //
    // Notification can be:
    // - unread + email sent
    // - unread + email not sent
    // - read + email sent
    // etc.

    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: {
      type: Date,
      default: null,
    },

    emailError: {
      type: String,
      default: "",
    },

    // ========================================================
    // PRIORITY
    // ========================================================

    priority: {
      type: String,
      enum: [
        "low",
        "normal",
        "high",
        "urgent",
      ],
      default: "normal",
    },
  },

  {
    timestamps: true,
  }
);


// ============================================================
// INDEXES
// ============================================================

// Quickly retrieve a user's newest notifications.

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});


// Quickly retrieve unread notifications.

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});


// ============================================================
// EXPORT
// ============================================================

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);