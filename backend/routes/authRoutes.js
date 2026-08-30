const express = require("express");

const router = express.Router();

const {
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// AUTH ROUTES
// ==========================================

// Login
router.post(
  "/login",
  loginUser
);

// ==========================================
// CURRENT USER
// GET /api/auth/me
// ==========================================

router.get(
  "/me",
  protect,
  getCurrentUser
);

// ==========================================
// PASSWORD RESET
// ==========================================

// Send password reset email
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset password
router.put(
  "/reset-password/:token",
  resetPassword
);

module.exports = router;