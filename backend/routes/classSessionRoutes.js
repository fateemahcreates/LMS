const express = require("express");

const router = express.Router();

const {
  createClassSession,
} = require("../controllers/classSessionController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");


// ======================================================
// CREATE CLASS SESSION
// POST /api/class-sessions
// ADMIN + INSTRUCTOR
// ======================================================

router.post(
  "/",
  protect,
  authorize("admin", "instructor"),
  createClassSession
);


module.exports = router;