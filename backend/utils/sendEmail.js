const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // Basic Information
    // ==========================

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // ==========================
    // User Role
    // ==========================

    role: {
      type: String,
      enum: ["admin", "student", "instructor"],
      default: "student",
    },

    // ==========================
    // Account Verification
    // ==========================

    verified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    // ==========================
    // Password Reset
    // ==========================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    // ==========================
    // Account Status
    // ==========================

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);