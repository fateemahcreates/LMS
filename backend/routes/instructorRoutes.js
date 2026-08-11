const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const {
  getInstructorDashboard,
  getInstructorStudents,
} = require("../controllers/instructorController");

// ======================================
// Instructor Dashboard
// ======================================

router.get(
  "/dashboard",
  protect,
  authorize("instructor"),
  getInstructorDashboard
);

router.get(
  "/students",
  protect,
  authorize("Instructor"),
  getInstructorStudents
);

module.exports = router;