const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  getSettings,
  updateProfile,
  changePassword,
  updateNotifications,
  getAccount,
} = require("../controllers/settingsController");

const {
  passwordChangeLimiter,
  settingsLimiter,
} = require("../middleware/rateLimitMiddleware");


// ============================================================
// GET ALL SETTINGS
// GET /api/settings
// ============================================================

router.get(
  "/",
  protect,
  settingsLimiter,
  getSettings
);


// ============================================================
// UPDATE PROFILE
// PUT /api/settings/profile
// ============================================================

router.put(
  "/profile",
  protect,
  settingsLimiter,
  updateProfile
);


// ============================================================
// CHANGE PASSWORD
// PUT /api/settings/password
// ============================================================

router.put(
  "/password",
  protect,
  passwordChangeLimiter,
  changePassword
);


// ============================================================
// UPDATE NOTIFICATIONS
// PUT /api/settings/notifications
// ============================================================

router.put(
  "/notifications",
  protect,
  settingsLimiter,
  updateNotifications
);


// ============================================================
// GET ACCOUNT
// GET /api/settings/account
// ============================================================

router.get(
  "/account",
  protect,
  settingsLimiter,
  getAccount
);


module.exports = router;