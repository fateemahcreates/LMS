const rateLimit = require("express-rate-limit");

// ============================================================
// PASSWORD CHANGE RATE LIMIT
// ============================================================

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    message:
      "Too many password change attempts. Please try again later.",
  },
});


// ============================================================
// SETTINGS RATE LIMIT
// ============================================================

const settingsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    message:
      "Too many settings requests. Please try again later.",
  },
});


module.exports = {
  passwordChangeLimiter,
  settingsLimiter,
};