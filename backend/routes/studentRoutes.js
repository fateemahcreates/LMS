const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentStats,
} = require("../controllers/studentController");
// ==========================
// Admin Routes
// ==========================

router.get(
  "/",
  protect,
  authorize("admin"),
  getStudents
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createStudent
);

router.get(
"/stats",
protect,
authorize("student"),
getStudentStats
);

router.put(
  "/profile",
  protect,
  authorize("student"),
  updateStudentProfile
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateStudent
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteStudent
);

// ==========================
// Student Routes
// ==========================

router.get(
  "/profile",
  protect,
  authorize("student"),
  getStudentProfile
);

module.exports = router;