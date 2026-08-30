const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// VERIFY JWT TOKEN
// ==========================================
const protect = async (req, res, next) => {
  try {
    let token;

    // ==========================================
    // CHECK AUTHORIZATION HEADER
    // ==========================================
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token =
        req.headers.authorization.split(" ")[1];

      // ==========================================
      // VERIFY JWT
      // ==========================================
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // ==========================================
      // GET CURRENT USER FROM DATABASE
      // ==========================================
      const user = await User.findById(
        decoded.id
      ).select("-password");

      // ==========================================
      // USER DOES NOT EXIST
      // ==========================================
      if (!user) {
        return res.status(401).json({
          message: "User not found.",
          code: "USER_NOT_FOUND",
        });
      }

      // ==========================================
      // CHECK ACCOUNT STATUS
      // ==========================================
      if (user.status === "suspended") {
        return res.status(401).json({
          message:
            "Your account has been suspended. Please contact an administrator.",
          code: "ACCOUNT_SUSPENDED",
        });
      }

      // ==========================================
      // CHECK INACTIVE ACCOUNT
      // ==========================================
      if (user.status === "inactive") {
        return res.status(401).json({
          message:
            "Your account is inactive. Please contact an administrator.",
          code: "ACCOUNT_INACTIVE",
        });
      }

      // ==========================================
      // ACTIVE USER
      // ==========================================
      req.user = user;

      return next();
    }

    // ==========================================
    // NO TOKEN
    // ==========================================
    return res.status(401).json({
      message:
        "Not authorized. No token provided.",
      code: "NO_TOKEN",
    });

  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    // ==========================================
    // INVALID / EXPIRED TOKEN
    // ==========================================
    return res.status(401).json({
      message: "Invalid token.",
      code: "INVALID_TOKEN",
    });
  }
};

// ==========================================
// ADMIN ONLY
// ==========================================
const adminOnly = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "admin"
  ) {
    return next();
  }

  return res.status(403).json({
    message:
      "Access denied. Admins only.",
  });
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  protect,
  adminOnly,
};