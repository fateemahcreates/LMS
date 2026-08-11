const express = require("express");

const router = express.Router();

const {
  createCourse,
  getCourses,
  getInstructorCourses,
  getPublishedCourses,
  getCourseById,
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

router.get(
  "/my-courses",
  protect,
 authorize("instructor"),
  getInstructorCourses
);

// ==========================================
// GET SINGLE COURSE
// ==========================================
router.get(
  "/:id",
  protect,
  authorize("admin", "instructor"),
  getCourseById
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