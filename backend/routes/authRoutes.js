const express = require("express");

const router = express.Router();

const {
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// ==========================================
// AUTH ROUTES
// ==========================================

// Login
router.post("/login", loginUser);

// ==========================================
// PASSWORD RESET
// ==========================================

// Send password reset email
router.post("/forgot-password", forgotPassword);

// Reset password
router.put("/reset-password/:token", resetPassword);

module.exports = router;