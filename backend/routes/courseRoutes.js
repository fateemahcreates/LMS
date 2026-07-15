const express = require("express");

const {
  createCourse,
  getCourses,
  getPublishedCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================
// CREATE COURSE
// POST /api/courses
// Admin Only
// ==========================
router.post("/", protect, authorize("admin"), createCourse);


// ==========================
// GET ALL COURSES
// GET /api/courses
// Admin & Student
// ==========================
router.get(
  "/published",
  protect,
  authorize("student"),
  getPublishedCourses
);

router.get("/", protect, authorize("admin", "student"), getCourses);

// ==========================
// UPDATE COURSE
// PUT /api/courses/:id
// Admin Only
// ==========================
router.put("/:id", protect, authorize("admin"), updateCourse);

// ==========================
// DELETE COURSE
// DELETE /api/courses/:id
// Admin Only
// ==========================
router.delete("/:id", protect, authorize("admin"), deleteCourse);

module.exports = router;