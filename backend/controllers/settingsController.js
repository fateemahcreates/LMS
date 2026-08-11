const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ============================================================
// PASSWORD STRENGTH VALIDATOR
// ============================================================

const validateStrongPassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=~`';]/.test(password)) {
    errors.push("one special character");
  }

  return errors;
};


// ============================================================
// GET SETTINGS
// GET /api/settings
// ============================================================

const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message: "Settings loaded successfully.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        status: user.status,

        studentId: user.studentId || null,

        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || null,
        nationality: user.nationality || "",
        address: user.address || "",
        bio: user.bio || "",
        avatar: user.avatar || "",

        notificationPreferences:
          user.notificationPreferences || {
            emailNotifications: true,
            assignmentNotifications: true,
            announcementNotifications: true,
            courseNotifications: true,
            systemNotifications: true,
          },

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      message: "Failed to load settings.",
      error: error.message,
    });
  }
};


// ============================================================
// UPDATE PROFILE
// PUT /api/settings/profile
// ============================================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      gender,
      dateOfBirth,
      nationality,
      address,
      bio,
      avatar,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ========================================================
    // NAME
    // ========================================================

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty.",
        });
      }

      user.name = name.trim();
    }

    // ========================================================
    // PHONE
    // ========================================================

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    // ========================================================
    // GENDER
    // ========================================================

    if (gender !== undefined) {
      user.gender = gender;
    }

    // ========================================================
    // DATE OF BIRTH
    // ========================================================

    if (dateOfBirth !== undefined) {
      user.dateOfBirth = dateOfBirth || null;
    }

    // ========================================================
    // NATIONALITY
    // ========================================================

    if (nationality !== undefined) {
      user.nationality = nationality.trim();
    }

    // ========================================================
    // ADDRESS
    // ========================================================

    if (address !== undefined) {
      user.address = address.trim();
    }

    // ========================================================
    // BIO
    // ========================================================

    if (bio !== undefined) {
      user.bio = bio.trim();
    }

    // ========================================================
    // AVATAR
    // ========================================================

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        studentId: user.studentId || null,

        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || null,
        nationality: user.nationality || "",
        address: user.address || "",
        bio: user.bio || "",
        avatar: user.avatar || "",

        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};


// ============================================================
// CHANGE PASSWORD
// PUT /api/settings/password
// ============================================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // ========================================================
    // VALIDATE REQUIRED FIELDS
    // ========================================================

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Please fill in all password fields.",
      });
    }

    // ========================================================
    // CONFIRM NEW PASSWORD
    // ========================================================

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match.",
      });
    }

    // ========================================================
    // PASSWORD STRENGTH
    // ========================================================

    const passwordErrors =
      validateStrongPassword(newPassword);

    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message:
          "Password is not strong enough.",
        requirements: passwordErrors,
        passwordRules: {
          minLength: 8,
          uppercase: true,
          lowercase: true,
          number: true,
          specialCharacter: true,
        },
      });
    }

    // ========================================================
    // FIND USER
    // ========================================================

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ========================================================
    // VERIFY CURRENT PASSWORD
    // ========================================================

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    // ========================================================
    // PREVENT PASSWORD REUSE
    // ========================================================

    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from your current password.",
      });
    }

    // ========================================================
    // HASH NEW PASSWORD
    // ========================================================

    const salt =
      await bcrypt.genSalt(10);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    // ========================================================
    // SAVE USER
    // ========================================================

    await user.save();

    res.status(200).json({
      message:
        "Password changed successfully.",
    });

  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to change password.",
      error: error.message,
    });
  }
};


// ============================================================
// UPDATE NOTIFICATION PREFERENCES
// PUT /api/settings/notifications
// ============================================================

const updateNotifications = async (req, res) => {
  try {
    const {
      emailNotifications,
      assignmentNotifications,
      announcementNotifications,
      courseNotifications,
      systemNotifications,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ========================================================
    // INITIALIZE PREFERENCES
    // ========================================================

    if (!user.notificationPreferences) {
      user.notificationPreferences = {};
    }

    // ========================================================
    // UPDATE PREFERENCES
    // ========================================================

    if (
      emailNotifications !== undefined
    ) {
      user.notificationPreferences.emailNotifications =
        Boolean(emailNotifications);
    }

    if (
      assignmentNotifications !== undefined
    ) {
      user.notificationPreferences.assignmentNotifications =
        Boolean(assignmentNotifications);
    }

    if (
      announcementNotifications !== undefined
    ) {
      user.notificationPreferences.announcementNotifications =
        Boolean(announcementNotifications);
    }

    if (
      courseNotifications !== undefined
    ) {
      user.notificationPreferences.courseNotifications =
        Boolean(courseNotifications);
    }

    if (
      systemNotifications !== undefined
    ) {
      user.notificationPreferences.systemNotifications =
        Boolean(systemNotifications);
    }

    await user.save();

    res.status(200).json({
      message:
        "Notification preferences updated successfully.",

      notificationPreferences:
        user.notificationPreferences,
    });

  } catch (error) {
    console.error(
      "Update notifications error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update notification preferences.",
      error: error.message,
    });
  }
};


// ============================================================
// GET ACCOUNT INFORMATION
// GET /api/settings/account
// ============================================================

const getAccount = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      message:
        "Account information loaded successfully.",

      account: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        verified: user.verified,

        studentId:
          user.studentId || null,

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

  } catch (error) {
    console.error(
      "Get account error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load account information.",
      error: error.message,
    });
  }
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getSettings,
  updateProfile,
  changePassword,
  updateNotifications,
  getAccount,
};