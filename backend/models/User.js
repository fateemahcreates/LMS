const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ==========================================
    // ROLE
    // ==========================================

    role: {
      type: String,
      enum: ["admin", "student", "instructor"],
      default: "student",
    },

    // ==========================================
    // ACCOUNT VERIFICATION
    // ==========================================

    verified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    // ==========================================
    // PASSWORD RESET
    // ==========================================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },

    // ==========================================
    // STUDENT ID
    // ==========================================

    studentId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // ==========================================
    // CONTACT INFORMATION
    // ==========================================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // PARENT / GUARDIAN INFORMATION
    // ==========================================

    parentPhone: {
      type: String,
      default: "",
      trim: true,
    },

    guardianPhone: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    nationality: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    // ==========================================
    // NOTIFICATION PREFERENCES
    // ==========================================

    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },

      assignmentNotifications: {
        type: Boolean,
        default: true,
      },

      announcementNotifications: {
        type: Boolean,
        default: true,
      },

      courseNotifications: {
        type: Boolean,
        default: true,
      },

      systemNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);