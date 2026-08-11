const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // ==========================================
    // LINK TO AUTHENTICATED USER
    // ==========================================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ==========================================
    // AUTOMATICALLY GENERATED STUDENT ID
    // ==========================================
    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    // ==========================================
    // PROGRAM
    // ==========================================
    program: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // COHORT
    // ==========================================
    cohort: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // PHONE
    // ==========================================
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // ADDRESS
    // ==========================================
    address: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // AVATAR
    // ==========================================
    avatar: {
      type: String,
      default: "",
    },

    // ==========================================
    // STUDENT STATUS
    // ==========================================
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Student",
  studentSchema
);