const express = require("express");

const router = express.Router();

const {
  // ==========================================
  // ADMIN
  // ==========================================
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,

  // ==========================================
  // INSTRUCTOR
  // ==========================================
  createInstructorAssignment,
  getInstructorAssignments,
  updateInstructorAssignment,
  deleteInstructorAssignment,

  // ==========================================
  // STUDENT
  // ==========================================
  getStudentAssignments,
  getUpcomingDeadlines,
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");


// ======================================================
// STUDENT ROUTES
// ======================================================

// ------------------------------------------
// GET STUDENT ASSIGNMENTS
// GET /api/assignments/student
// ------------------------------------------

router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentAssignments
);


// ------------------------------------------
// GET UPCOMING DEADLINES
// GET /api/assignments/upcoming
// ------------------------------------------

router.get(
  "/upcoming",
  protect,
  authorize("student"),
  getUpcomingDeadlines
);


// ======================================================
// INSTRUCTOR ROUTES
// ======================================================

// ------------------------------------------
// GET INSTRUCTOR ASSIGNMENTS
// GET /api/assignments/instructor
// ------------------------------------------

router.get(
  "/instructor",
  protect,
  authorize("instructor"),
  getInstructorAssignments
);


// ------------------------------------------
// CREATE INSTRUCTOR ASSIGNMENT
// POST /api/assignments/instructor
// ------------------------------------------

router.post(
  "/instructor",
  protect,
  authorize("instructor"),
  createInstructorAssignment
);


// ------------------------------------------
// UPDATE INSTRUCTOR ASSIGNMENT
// PUT /api/assignments/instructor/:id
// ------------------------------------------

router.put(
  "/instructor/:id",
  protect,
  authorize("instructor"),
  updateInstructorAssignment
);


// ------------------------------------------
// DELETE INSTRUCTOR ASSIGNMENT
// DELETE /api/assignments/instructor/:id
// ------------------------------------------

router.delete(
  "/instructor/:id",
  protect,
  authorize("instructor"),
  deleteInstructorAssignment
);


// ======================================================
// ADMIN ROUTES
// ======================================================

// ------------------------------------------
// GET ALL ASSIGNMENTS
// GET /api/assignments
// ------------------------------------------

router.get(
  "/",
  protect,
  authorize("admin"),
  getAssignments
);


// ------------------------------------------
// GET SINGLE ASSIGNMENT
// GET /api/assignments/:id
// ------------------------------------------

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getAssignmentById
);


// ------------------------------------------
// CREATE ASSIGNMENT
// POST /api/assignments
// ------------------------------------------

router.post(
  "/",
  protect,
  authorize("admin"),
  createAssignment
);


// ------------------------------------------
// UPDATE ASSIGNMENT
// PUT /api/assignments/:id
// ------------------------------------------

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateAssignment
);


// ------------------------------------------
// DELETE ASSIGNMENT
// DELETE /api/assignments/:id
// ------------------------------------------

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAssignment
);


module.exports = router;