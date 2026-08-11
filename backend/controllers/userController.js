const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Student = require("../models/Student");

const sendEmail = require("../utils/sendEmail");

// ==========================================
// GENERATE STUDENT ID
// ==========================================
const generateStudentId = async () => {
  let studentId;
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(
      100000 + Math.random() * 900000
    );

    studentId = `GMT-STU-${new Date().getFullYear()}-${randomNumber}`;

    exists = await Student.exists({
      studentId,
    });
  }

  return studentId;
};

// ==========================================
// SEND NEW USER LOGIN EMAIL
// ==========================================
const sendNewUserCredentialsEmail = async ({
  user,
  password,
}) => {
  try {
    if (!user || !user.email) {
      throw new Error(
        "User email is required to send login details."
      );
    }

    const clientUrl =
      process.env.CLIENT_URL ||
      "http://localhost:5173";

    // ========================================
    // ROLE DISPLAY
    // ========================================

    const roleLabel =
      user.role === "admin"
        ? "Administrator"
        : user.role === "instructor"
        ? "Instructor"
        : "Student";

    // ========================================
    // STUDENT ID
    // ========================================

    const studentIdSection =
      user.studentId
        ? `
          <div
            style="
              margin-top:18px;
              padding:14px 16px;
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:8px;
            "
          >
            <p
              style="
                margin:0;
                font-size:13px;
                color:#6b7280;
              "
            >
              Student ID
            </p>

            <p
              style="
                margin:5px 0 0;
                font-size:16px;
                font-weight:bold;
                color:#111827;
              "
            >
              ${user.studentId}
            </p>
          </div>
        `
        : "";

    // ========================================
    // EMAIL HTML
    // ========================================

    const html = `
      <!DOCTYPE html>

      <html>

      <head>

        <meta
          charset="UTF-8"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          GMT LMS Account
        </title>

      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f5f7fb;
          font-family:Arial,Helvetica,sans-serif;
        "
      >

        <div
          style="
            max-width:650px;
            margin:40px auto;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            border:1px solid #e5e7eb;
          "
        >

          <!-- HEADER -->

          <div
            style="
              padding:30px 32px;
              background:#C91F26;
              color:#ffffff;
            "
          >

            <h1
              style="
                margin:0;
                font-size:26px;
              "
            >
              GMT LMS
            </h1>

            <p
              style="
                margin:8px 0 0;
                font-size:14px;
                opacity:0.9;
              "
            >
              Learning Management System
            </p>

          </div>


          <!-- CONTENT -->

          <div
            style="
              padding:32px;
              color:#111827;
            "
          >

            <h2
              style="
                margin:0 0 16px;
                font-size:23px;
              "
            >
              Welcome to GMT LMS
            </h2>


            <p
              style="
                margin:0;
                font-size:15px;
                line-height:1.7;
                color:#4b5563;
              "
            >
              Hello ${user.name || "User"},
            </p>


            <p
              style="
                margin:16px 0 0;
                font-size:15px;
                line-height:1.7;
                color:#4b5563;
              "
            >
              Your GMT LMS account has been created successfully.
              You can use the login details below to access your account.
            </p>


            <!-- ACCOUNT DETAILS -->

            <div
              style="
                margin-top:25px;
                padding:20px;
                background:#f9fafb;
                border:1px solid #e5e7eb;
                border-radius:10px;
              "
            >

              <h3
                style="
                  margin:0 0 16px;
                  font-size:17px;
                  color:#111827;
                "
              >
                Your Login Details
              </h3>


              <!-- NAME -->

              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Name:</strong>
                ${user.name}
              </p>


              <!-- EMAIL -->

              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Email:</strong>
                ${user.email}
              </p>


              <!-- ROLE -->

              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Role:</strong>
                ${roleLabel}
              </p>


              <!-- PASSWORD -->

              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Password:</strong>
                ${password}
              </p>

              ${studentIdSection}

            </div>


            <!-- SECURITY NOTICE -->

            <div
              style="
                margin-top:22px;
                padding:15px 17px;
                background:#fff7ed;
                border:1px solid #fed7aa;
                border-radius:8px;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:13px;
                  line-height:1.6;
                  color:#9a3412;
                "
              >
                For your security, please change your password
                after your first login and do not share your
                login credentials with anyone.
              </p>

            </div>


            <!-- LOGIN BUTTON -->

            <div
              style="
                margin-top:28px;
              "
            >

              <a
                href="${clientUrl}/login"
                style="
                  display:inline-block;
                  padding:13px 24px;
                  background:#C91F26;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:7px;
                  font-size:14px;
                  font-weight:bold;
                "
              >
                Login to GMT LMS
              </a>

            </div>


            <p
              style="
                margin:25px 0 0;
                font-size:13px;
                line-height:1.6;
                color:#9ca3af;
              "
            >
              If you did not expect this account to be created,
              please contact the GMT LMS administrator.
            </p>

          </div>


          <!-- FOOTER -->

          <div
            style="
              padding:20px 32px;
              border-top:1px solid #e5e7eb;
              background:#fafafa;
            "
          >

            <p
              style="
                margin:0;
                font-size:12px;
                color:#9ca3af;
                line-height:1.6;
              "
            >
              This email was sent automatically by GMT LMS.
            </p>

            <p
              style="
                margin:8px 0 0;
                font-size:12px;
                color:#9ca3af;
              "
            >
              GMT LMS Team
            </p>

          </div>

        </div>

      </body>

      </html>
    `;

    // ========================================
    // SEND EMAIL
    // ========================================

    await sendEmail({
      to: user.email,
      subject: "Welcome to GMT LMS - Your Login Details",
      html,
    });

    console.log(
      `New user login email sent to ${user.email}`
    );

    return {
      sent: true,
      error: null,
    };

  } catch (error) {

    console.error(
      "New user email error:",
      error.message
    );

    return {
      sent: false,
      error: error.message,
    };
  }
};


// ==========================================
// GET ALL USERS
// GET /api/users
// ==========================================
const getUsers = async (req, res) => {
  try {

    const users =
      await User.find()
        .select("-password");

    res.status(200).json(users);

  } catch (error) {

    console.error(
      "Get users error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// ==========================================
// GET SINGLE USER
// GET /api/users/:id
// ==========================================
const getUser = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.params.id
      ).select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found.",
      });

    }

    res.status(200).json(user);

  } catch (error) {

    console.error(
      "Get user error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });

  }
};


// ==========================================
// CREATE USER
// POST /api/users
// ==========================================
const createUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,

      // General user information
      phone,
      gender,
      dateOfBirth,
      nationality,
      address,
      bio,
      avatar,

      // Student information
      program,
      cohort,

      // Account status
      status,

    } = req.body;


    // ========================================
    // VALIDATE COMMON FIELDS
    // ========================================

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {

      return res.status(400).json({
        message:
          "Please fill in all required fields.",
      });

    }


    // ========================================
    // VALIDATE ROLE
    // ========================================

    if (
      ![
        "admin",
        "student",
        "instructor",
      ].includes(role)
    ) {

      return res.status(400).json({
        message:
          "Invalid user role.",
      });

    }


    // ========================================
    // CHECK EXISTING EMAIL
    // ========================================

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {

      return res.status(400).json({
        message:
          "Email already exists.",
      });

    }


    // ========================================
    // KEEP ORIGINAL PASSWORD
    // ========================================
    //
    // IMPORTANT:
    // We need the original password for
    // the welcome email.
    //
    // We NEVER save this plain password
    // in MongoDB.
    // ========================================

    const originalPassword =
      password;


    // ========================================
    // HASH PASSWORD
    // ========================================

    const hashedPassword =
      await bcrypt.hash(
        originalPassword,
        10
      );


    // ========================================
    // CREATE USER
    // ========================================

    const user =
      await User.create({

        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role,

        phone:
          phone || "",

        gender:
          gender || "",

        dateOfBirth:
          dateOfBirth || null,

        nationality:
          nationality || "",

        address:
          address || "",

        bio:
          bio || "",

        avatar:
          avatar || "",

        status:
          status || "active",

      });


    // ========================================
    // STUDENT PROFILE
    // ========================================

    let student = null;


    if (role === "student") {

      // ======================================
      // GENERATE STUDENT ID
      // ======================================

      const studentId =
        await generateStudentId();


      // ======================================
      // SAVE STUDENT ID TO USER
      // ======================================

      user.studentId =
        studentId;

      await user.save();


      // ======================================
      // CREATE STUDENT PROFILE
      // ======================================

      student =
        await Student.create({

          user:
            user._id,

          studentId,

          program:
            program || "",

          cohort:
            cohort || "",

          phone:
            phone || "",

          address:
            address || "",

          avatar:
            avatar || "",

          status:
            status === "inactive"
              ? "inactive"
              : "active",

        });

    }


    // ========================================
    // SEND WELCOME EMAIL
    // ========================================
    //
    // This happens AFTER the account has
    // successfully been created.
    //
    // If email fails, the account remains
    // created.
    // ========================================

    const emailResult =
      await sendNewUserCredentialsEmail({
        user,
        password:
          originalPassword,
      });


    // ========================================
    // SUCCESS RESPONSE
    // ========================================

    res.status(201).json({

      message:
        emailResult.sent
          ? "User created successfully. Login details have been sent to the user's email."
          : "User created successfully, but the login email could not be sent.",

      emailSent:
        emailResult.sent,

      emailError:
        emailResult.error || null,

      user: {

        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        studentId:
          user.studentId || null,

        status:
          user.status,

      },

      student,

    });

  } catch (error) {

    console.error(
      "Create user error:",
      error
    );

    res.status(500).json({
      message:
        "Server Error",
      error:
        error.message,
    });

  }
};


// ==========================================
// UPDATE USER
// PUT /api/users/:id
// ==========================================
const updateUser = async (req, res) => {
  try {

    const { id } =
      req.params;

    const user =
      await User.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");


    if (!user) {

      return res.status(404).json({
        message:
          "User not found.",
      });

    }


    res.status(200).json({

      message:
        "User updated successfully.",

      user,

    });

  } catch (error) {

    console.error(
      "Update user error:",
      error
    );

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};


// ==========================================
// CHANGE USER ROLE
// PATCH /api/users/:id/role
// ==========================================
const changeUserRole = async (req, res) => {
  try {

    const { role } =
      req.body;


    if (
      ![
        "admin",
        "student",
        "instructor",
      ].includes(role)
    ) {

      return res.status(400).json({
        message:
          "Invalid role.",
      });

    }


    const user =
      await User.findById(
        req.params.id
      );


    if (!user) {

      return res.status(404).json({
        message:
          "User not found.",
      });

    }


    user.role =
      role;

    await user.save();


    res.status(200).json({

      message:
        "Role updated successfully.",

      user,

    });

  } catch (error) {

    console.error(
      "Change role error:",
      error
    );

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};


// ==========================================
// CHANGE USER STATUS
// PATCH /api/users/:id/status
// ==========================================
const changeUserStatus = async (req, res) => {
  try {

    const { status } =
      req.body;


    if (
      ![
        "active",
        "inactive",
        "suspended",
      ].includes(status)
    ) {

      return res.status(400).json({
        message:
          "Invalid status.",
      });

    }


    const user =
      await User.findById(
        req.params.id
      );


    if (!user) {

      return res.status(404).json({
        message:
          "User not found.",
      });

    }


    user.status =
      status;

    await user.save();


    res.status(200).json({

      message:
        "Status updated successfully.",

      user,

    });

  } catch (error) {

    console.error(
      "Change status error:",
      error
    );

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};


// ==========================================
// GET ALL INSTRUCTORS
// GET /api/users/instructors
// ==========================================
const getInstructors = async (req, res) => {
  try {

    const instructors =
      await User.find({

        role:
          "instructor",

        status:
          "active",

      }).select(
        "name email"
      );


    res.status(200).json(
      instructors
    );

  } catch (error) {

    console.error(
      "Get instructors error:",
      error
    );

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};


// ==========================================
// DELETE USER
// DELETE /api/users/:id
// ==========================================
const deleteUser = async (req, res) => {
  try {

    const { id } =
      req.params;


    const user =
      await User.findById(id);


    if (!user) {

      return res.status(404).json({
        message:
          "User not found.",
      });

    }


    // ======================================
    // DELETE STUDENT PROFILE
    // ======================================

    if (
      user.role === "student"
    ) {

      await Student.findOneAndDelete({
        user:
          user._id,
      });

    }


    // ======================================
    // DELETE USER
    // ======================================

    await user.deleteOne();


    res.status(200).json({

      message:
        "User deleted successfully.",

    });

  } catch (error) {

    console.error(
      "Delete user error:",
      error
    );

    res.status(500).json({
      message:
        "Server Error",
    });

  }
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {

  getUsers,
  getUser,
  createUser,

  updateUser,
  deleteUser,

  changeUserRole,
  changeUserStatus,

  getInstructors,

};