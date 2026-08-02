const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const {
  getLatestActivity,
} = require("../controllers/activityController");

// ==========================================
// ADMIN - Latest Activity
// ==========================================

router.get(
  "/latest",
  protect,
  authorize("admin"),
  getLatestActivity
);

module.exports = router;