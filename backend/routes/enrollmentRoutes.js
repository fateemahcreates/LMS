const express = require("express");

const {
  enrollCourse,
  getMyCourses,
  continueLearning,
  removeEnrollment,
  getAllEnrollments,
  approveCertificate,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// ENROLL IN A COURSE
// POST /api/enrollments
// Student Only
// ==========================================
router.post(
  "/",
  protect,
  authorize("student"),
  enrollCourse
);

router.put(
    "/continue/:id",
    protect,
    authorize("student"),
    continueLearning
);

router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveCertificate
);

// ==========================================
// GET MY ENROLLED COURSES
// GET /api/enrollments/my
// Student Only
// ==========================================
router.get(
  "/my",
  protect,
  authorize("student"),
  getMyCourses
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllEnrollments
);

// ==========================================
// REMOVE ENROLLMENT
// DELETE /api/enrollments/:id
// Student Only
// ==========================================
router.delete(
  "/:id",
  protect,
  authorize("student"),
  removeEnrollment
);

module.exports = router;