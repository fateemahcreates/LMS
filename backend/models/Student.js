const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Link to authenticated user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    faculty: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      required: true,
    },

    semester: {
      type: String,
      default: "First Semester",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

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

module.exports = mongoose.model("Student", studentSchema);