const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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

    role: {
      type: String,
      enum: ["admin", "student", "instructor"],
      default: "student",
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
    studentId: {
  type: String,
  unique: true,
  sparse: true,
},

phone: {
  type: String,
  default: "",
},

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
},

address: {
  type: String,
  default: "",
},

bio: {
  type: String,
  default: "",
},

avatar: {
  type: String,
  default: "",
},

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