const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const {
  getStudentDashboard,
} = require("../controllers/dashboardController");

// ==========================================
// STUDENT DASHBOARD
// ==========================================

router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentDashboard
);

module.exports = router;