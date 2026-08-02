const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  getStudentAssignments,
  updateAssignment,
  deleteAssignment,
  getUpcomingDeadlines,
} = require("../controllers/assignmentController");


const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");


// ===============================
// STUDENT ROUTES
// ===============================


// Get student assignments
// GET /api/assignments/student

router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentAssignments
);


// Get upcoming deadlines
// GET /api/assignments/upcoming

router.get(
  "/upcoming",
  protect,
  authorize("student"),
  getUpcomingDeadlines
);



// Get all assignments

router.get(
  "/",
  protect,
  getAssignments
);



// Get single assignment

router.get(
  "/:id",
  protect,
  getAssignmentById
);




// ===============================
// ADMIN ONLY
// ===============================


// Create assignment

router.post(
  "/",
  protect,
  authorize("admin"),
  createAssignment
);



// Update assignment

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateAssignment
);



// Delete assignment

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAssignment
);



module.exports = router;