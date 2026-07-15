const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ===============================
// STUDENTS & ADMINS
// ===============================

router.get(
  "/",
  protect,
  getAssignments
);

router.get(
  "/:id",
  protect,
  getAssignment
);

// ===============================
// ADMIN ONLY
// ===============================

router.post(
  "/",
  protect,
  authorize("admin"),
  createAssignment
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateAssignment
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAssignment
);

module.exports = router;