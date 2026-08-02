const express = require("express");

const router = express.Router();

const {
  createCourse,
  getCourses,
  getPublishedCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");


// ==========================================
// GET ALL COURSES
// ADMIN + INSTRUCTOR
// ==========================================

router.get(
  "/",
  protect,
  authorize("admin", "instructor"),
  getCourses
);


// ==========================================
// GET PUBLISHED COURSES
// STUDENTS
// ==========================================

router.get(
  "/published",
  protect,
  getPublishedCourses
);


// ==========================================
// CREATE COURSE
// ==========================================

router.post(
  "/",
  protect,
  authorize("admin", "instructor"),
  createCourse
);


// ==========================================
// UPDATE COURSE
// ==========================================

router.put(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  updateCourse
);


// ==========================================
// DELETE COURSE
// ==========================================

router.delete(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  deleteCourse
);


module.exports = router;