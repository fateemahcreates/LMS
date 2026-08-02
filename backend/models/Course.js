const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // ==========================
    // Basic Information
    // ==========================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },


    // ==========================
    // Category
    // ==========================

    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "Mobile",
        "UI/UX",
        "Data Science",
        "AI",
        "DevOps",
        "Cybersecurity",
        "Cloud",
      ],
      default: "Frontend",
      required: true,
    },


    // ==========================
    // Difficulty
    // ==========================

    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
    },


    duration: {
      type: String,
      default: "",
    },


   // ==========================
// Instructor
// ==========================

// Display name
instructor: {
  type: String,
  required: true,
  trim: true,
},

// Relationship to User
instructorUser: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    // ==========================
    // Thumbnail
    // ==========================

    thumbnail: {
      type: String,
      default: "",
    },


    // ==========================
    // Price
    // ==========================

    price: {
      type: Number,
      default: 0,
      min: 0,
    },


    // ==========================
    // Course Status
    // ==========================

    status: {
      type: String,
      enum: [
        "Draft",
        "Published",
        "Archived",
      ],
      default: "Draft",
    },


    // ==========================
    // Enrolled Students
    // ==========================

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],


    // ==========================
    // Statistics
    // ==========================

    totalLessons: {
      type: Number,
      default: 0,
    },


    totalAssignments: {
      type: Number,
      default: 0,
    },


    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model(
  "Course",
  courseSchema
);