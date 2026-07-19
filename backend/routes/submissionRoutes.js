const express = require("express");

const router = express.Router();

const {
  submitAssignment,
  getMySubmissions,
  getAllSubmissions,
  gradeSubmission,
  deleteSubmission,
  getAcademyAssignments,
} = require("../controllers/submissionController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// We will create this in the next step
const upload = require("../middleware/uploadMiddleware");

// =======================================
// STUDENT ROUTES
// =======================================

// Submit Assignment
router.post(
  "/",
  protect,
  authorize("student"),
  upload.single("file"),
  submitAssignment
);

// View My Submissions
router.get(
  "/my",
  protect,
  authorize("student"),
  getMySubmissions
);


// View Academy Assignments (for students)
router.get(
  "/academy",
  protect,
  authorize("student"),
  getAcademyAssignments
);

// =======================================
// ADMIN ROUTES
// =======================================

// View All Student Submissions
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllSubmissions
);

// Grade Submission
router.put(
  "/:id",
  protect,
  authorize("admin"),
  gradeSubmission
);

// Delete Submission
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteSubmission
);

module.exports = router;