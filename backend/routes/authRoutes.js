const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// ==========================================
// AUTH ROUTES
// ==========================================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ==========================================
// FORGOT PASSWORD
// ==========================================

// Send password reset email
router.post("/forgot-password", forgotPassword);

// Reset password
router.put("/reset-password/:token", resetPassword);

module.exports = router;