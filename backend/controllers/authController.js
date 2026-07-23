const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// ==============================
// Register User
// ==============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }
    
    // ==============================
// Generate Student ID
// ==============================

const year = new Date().getFullYear();

const lastStudent = await User.findOne({
  studentId: { $exists: true },
}).sort({ createdAt: -1 });

let nextNumber = 1;

if (lastStudent) {
  const lastId = lastStudent.studentId;

  const number = parseInt(lastId.split("-")[3], 10);

  nextNumber = number + 1;
}

const studentId = `GMT-STU-${year}-${String(nextNumber).padStart(4, "0")}`;
    const hashedPassword = await bcrypt.hash(password, 10);

// Create User
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role: "student",
  studentId,
});

// Create Student Profile
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
  console.error(error);

  res.status(500).json({
    message: error.message,
  });
}
};

// ==============================
// Login User
// ==============================
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

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
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// ==========================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with that email.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiry
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires =
      Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Email template
    const html = `
      <div style="font-family:Arial,sans-serif;padding:30px;">
        <h2>Password Reset Request</h2>

        <p>Hello ${user.name},</p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to reset it.
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            margin-top:20px;
            padding:12px 25px;
            background:#2563eb;
            color:#fff;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top:25px;">
          This link expires in 10 minutes.
        </p>

        <p>
          If you didn't request this,
          simply ignore this email.
        </p>

        <br/>

        <strong>GMT LMS Team</strong>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Password",
      html,
    });

    res.status(200).json({
      message: "Password reset link sent successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ==========================================
// RESET PASSWORD
// PUT /api/auth/reset-password/:token
// ==========================================
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the token received from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find matching user with a valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token.",
      });
    }

    // Hash new password
    const bcrypt = require("bcryptjs");

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  // ...any other controllers you already export
};