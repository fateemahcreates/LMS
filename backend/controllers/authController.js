const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const welcomeEmail = require("../emails/welcomeEmail");
const generateStudentId = require("../utils/generateStudentId");

// ============================================================
// REGISTER USER
// POST /api/auth/register
// ============================================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ==============================
    // Validate fields
    // ==============================
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    // ==============================
    // Check existing user
    // ==============================
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // ==============================
    // Generate Student ID
    // ==============================
    const studentId = await generateStudentId();

    // ==============================
    // Hash Password
    // ==============================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ==============================
    // Create User
    // ==============================
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      studentId,
    });

    // ==============================
    // Create Student Profile
    // ==============================
    await Student.create({
      user: user._id,
      studentId,
      department: "Not Assigned",
      faculty: "",
      level: "100",
      semester: "First Semester",
      phone: "",
      address: "",
    });

    // ==============================
    // Welcome Email
    // ==============================
    const loginUrl = `${process.env.CLIENT_URL}/login`;

    await sendEmail({
      to: user.email,
      subject: "🎉 Welcome to GMT LMS",
      html: welcomeEmail(
        user,
        studentId,
        loginUrl
      ),
    });

    // ==============================
    // Response
    // ==============================
    res.status(201).json({
      message: "User registered successfully.",

      user: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ============================================================
// LOGIN USER
// POST /api/auth/login
// ============================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Email entered:", email);

    // ==============================
    // Find User
    // ==============================
    const user = await User.findOne({ email });

    console.log("User found:", user ? user._id : null);

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // ==============================
    // Compare Password
    // ==============================
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // ==============================
    // Generate JWT
    // ==============================
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // ==============================
    // Login Response
    // ==============================
    res.status(200).json({
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        studentId: user.studentId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ============================================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ==============================
    // Check Email
    // ==============================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with that email.",
      });
    }

    // ==============================
    // Generate Reset Token
    // ==============================
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    // ==============================
    // Hash Token Before Saving
    // ==============================
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // ==============================
    // Token Expiry
    // 10 Minutes
    // ==============================
    user.resetPasswordExpires =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    // ==============================
    // Reset URL
    // ==============================
    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // ==============================
    // Email Template
    // ==============================
    const html = `
      <div
        style="
          font-family: Arial, sans-serif;
          padding: 30px;
          max-width: 600px;
          margin: auto;
        "
      >

        <h2>Password Reset Request</h2>

        <p>
          Hello ${user.name},
        </p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to reset it.
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            margin-top: 20px;
            padding: 12px 25px;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 25px;">
          This link expires in 10 minutes.
        </p>

        <p>
          If you didn't request this,
          simply ignore this email.
        </p>

        <br />

        <strong>
          GMT LMS Team
        </strong>

      </div>
    `;

    // ==============================
    // Send Email
    // ==============================
    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html,
    });

    // ==============================
    // Response
    // ==============================
    res.status(200).json({
      message:
        "Password reset link sent successfully.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// RESET PASSWORD
// PUT /api/auth/reset-password/:token
// ============================================================
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // ==============================
    // Validate Password
    // ==============================
    if (!password) {
      return res.status(400).json({
        message: "Please provide a new password.",
      });
    }

    // ==============================
    // Hash Token From URL
    // ==============================
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // ==============================
    // Find User With Valid Token
    // ==============================
    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired reset token.",
      });
    }

    // ==============================
    // Hash New Password
    // ==============================
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      password,
      salt
    );

    // ==============================
    // Clear Reset Fields
    // ==============================
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // ==============================
    // Response
    // ==============================
    res.status(200).json({
      message:
        "Password reset successfully.",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ============================================================
// EXPORT CONTROLLERS
// ============================================================
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};