const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const {
  createCourse,
  getCourses,
  getPublishedCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

// ==========================================
// Public Routes
// ==========================================

// Students can browse published courses
router.get("/published", getPublishedCourses);

// ==========================================
// Admin + Instructor Routes
// ==========================================

// Get Courses
router.get(
  "/",
  protect,
  authorize("Admin", "Instructor"),
  getCourses
);

// Create Course
router.post(
  "/",
  protect,
  authorize("Admin", "Instructor"),
  createCourse
);

// Update Course
router.put(
  "/:id",
  protect,
  authorize("Admin", "Instructor"),
  updateCourse
);

// Delete Course
router.delete(
  "/:id",
  protect,
  authorize("Admin", "Instructor"),
  deleteCourse
);

module.exports = router;