const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    // ==========================================
    // CLASS SESSION
    // ==========================================
    // The specific class this attendance belongs to.
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassSession",
      required: true,
    },

    // ==========================================
    // COURSE
    // ==========================================
    // Stored directly for easier querying and
    // reporting by course.
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // ==========================================
    // STUDENT
    // ==========================================
    // This references the authenticated User
    // because Enrollment.student also uses User._id.
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // ATTENDANCE STATUS
    // ==========================================
    status: {
      type: String,
      enum: [
        "Present",
        "Absent",
        "Late",
        "Excused",
      ],
      default: "Absent",
    },

    // ==========================================
    // MARKED BY
    // ==========================================
    // The Admin or Instructor who recorded
    // this attendance.
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // MARKED AT
    // ==========================================
    markedAt: {
      type: Date,
      default: Date.now,
    },

    // ==========================================
    // OPTIONAL NOTE
    // ==========================================
    // Useful for things such as:
    // "Arrived 20 minutes late"
    // "Medical reason"
    // "Approved absence"
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
// PREVENT DUPLICATE ATTENDANCE
// ==========================================
// A student can only have ONE attendance
// record for a particular class session.
attendanceSchema.index(
  {
    session: 1,
    student: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Attendance",
  attendanceSchema
);