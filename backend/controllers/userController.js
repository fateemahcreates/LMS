const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Student = require("../models/Student");

// ==========================================
// GENERATE STUDENT ID
// ==========================================
//
// Format:
// GMT-STU-2026-000001
// GMT-STU-2026-000002
// GMT-STU-2026-000003
//
// The number increases sequentially.
// ==========================================

const generateStudentId = async () => {
  const currentYear = new Date().getFullYear();

  const prefix = `GMT-STU-${currentYear}-`;

  // ==========================================
  // FIND STUDENT IDs FOR CURRENT YEAR
  // ==========================================

  const students = await Student.find({
    studentId: {
      $regex: `^GMT-STU-${currentYear}-\\d{6}$`,
    },
  })
    .select("studentId")
    .lean();

  // ==========================================
  // FIND HIGHEST SEQUENCE NUMBER
  // ==========================================

  let highestNumber = 0;

  students.forEach((student) => {
    const numberPart = student.studentId.replace(
      prefix,
      ""
    );

    const number = parseInt(
      numberPart,
      10
    );

    if (
      !isNaN(number) &&
      number > highestNumber
    ) {
      highestNumber = number;
    }
  });

  // ==========================================
  // NEXT NUMBER
  // ==========================================

  const nextNumber =
    highestNumber + 1;

  // ==========================================
  // FORMAT AS 6 DIGITS
  // ==========================================

  const sequence =
    String(nextNumber).padStart(
      6,
      "0"
    );

  const studentId =
    `${prefix}${sequence}`;

  // ==========================================
  // SAFETY CHECK
  // ==========================================

  const exists =
    await Student.exists({
      studentId,
    });

  if (exists) {
    return generateStudentId();
  }

  return studentId;
};

// ==========================================
// GET ALL USERS
// GET /api/users
// ==========================================

const getUsers = async (req, res) => {
  try {
    // ==========================================
    // GET USERS WITHOUT PASSWORD
    // ==========================================

    const users = await User.find()
      .select("-password")
      .lean();

    // ==========================================
    // GET STUDENT PROFILES
    // ==========================================

    const studentIds = users
      .filter(
        (user) =>
          user.role === "student"
      )
      .map(
        (user) => user._id
      );

    const students =
      await Student.find({
        user: {
          $in: studentIds,
        },
      })
        .select(
          "user studentId program cohort phone parentPhone guardianPhone address avatar status"
        )
        .lean();

    // ==========================================
    // GET COURSES
    // ==========================================

    const Course =
      require("../models/Course");

    const courses =
      await Course.find({
        students: {
          $in: students.map(
            (student) =>
              student._id
          ),
        },
      })
        .select(
          "title code category level status students"
        )
        .lean();

    // ==========================================
    // CREATE STUDENT PROFILE MAP
    // ==========================================

    const studentMap =
      new Map();

    students.forEach(
      (student) => {
        studentMap.set(
          student.user.toString(),
          student
        );
      }
    );

    // ==========================================
    // ATTACH STUDENT + COURSE DATA
    // ==========================================

    const formattedUsers =
      users.map((user) => {
        const userData = {
          ...user,
          courses: [],
        };

        // ========================================
        // STUDENT DATA
        // ========================================

        if (
          user.role === "student"
        ) {
          const student =
            studentMap.get(
              user._id.toString()
            );

          if (student) {
            userData.studentId =
              student.studentId ||
              user.studentId ||
              null;

            userData.program =
              student.program || "";

            userData.cohort =
              student.cohort || "";

            userData.phone =
              student.phone ||
              user.phone ||
              "";

            userData.parentPhone =
              student.parentPhone ||
              user.parentPhone ||
              "";

            userData.guardianPhone =
              student.guardianPhone ||
              user.guardianPhone ||
              "";

            userData.address =
              student.address ||
              user.address ||
              "";

            userData.avatar =
              student.avatar ||
              user.avatar ||
              "";

            userData.studentStatus =
              student.status ||
              "active";

            // ====================================
            // FIND STUDENT COURSES
            // ====================================

            userData.courses =
              courses
                .filter((course) =>
                  course.students?.some(
                    (studentId) =>
                      studentId.toString() ===
                      student._id.toString()
                  )
                )
                .map(
                  (course) => ({
                    _id:
                      course._id,

                    title:
                      course.title,

                    code:
                      course.code,

                    category:
                      course.category,

                    level:
                      course.level,

                    status:
                      course.status,
                  })
                );
          }
        }

        return userData;
      });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json(
      formattedUsers
    );

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

const getUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      )
        .select("-password")
        .lean();

    if (!user) {
      return res.status(404).json({
        message:
          "User not found.",
      });
    }

    // ==========================================
    // GET STUDENT PROFILE
    // ==========================================

    let student = null;

    if (
      user.role === "student"
    ) {
      student =
        await Student.findOne({
          user: user._id,
        }).lean();
    }

    res.status(200).json({
      ...user,
      student,
    });

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

const createUser = async (
  req,
  res
) => {
  try {

    const {
      name,
      email,
      password,
      role,

      // ====================================
      // GENERAL USER INFORMATION
      // ====================================

      phone,
      gender,
      dateOfBirth,
      nationality,
      address,
      bio,
      avatar,

      // ====================================
      // STUDENT INFORMATION
      // ====================================

      program,
      cohort,
      parentPhone,
      guardianPhone,

      // ====================================
      // ACCOUNT STATUS
      // ====================================

      status,

    } = req.body;

    // ==========================================
    // VALIDATE BASIC REQUIRED FIELDS
    // ==========================================

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

    // ==========================================
    // VALIDATE ROLE
    // ==========================================

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

    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    if (
      status !== undefined &&
      ![
        "active",
        "inactive",
        "suspended",
      ].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid user status.",
      });
    }

    // ==========================================
    // STUDENT REQUIRED INFORMATION
    // ==========================================

    if (
      role === "student"
    ) {

      if (
        !parentPhone ||
        !parentPhone.trim()
      ) {
        return res.status(400).json({
          message:
            "Parent phone number is required for students.",
        });
      }

      if (
        !guardianPhone ||
        !guardianPhone.trim()
      ) {
        return res.status(400).json({
          message:
            "Guardian phone number is required for students.",
        });
      }

      if (
        !program ||
        !program.trim()
      ) {
        return res.status(400).json({
          message:
            "Program is required for students.",
        });
      }

      if (
        !cohort ||
        !cohort.trim()
      ) {
        return res.status(400).json({
          message:
            "Cohort is required for students.",
        });
      }
    }

    // ==========================================
    // CHECK EXISTING EMAIL
    // ==========================================

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

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ==========================================
    // CREATE USER
    // ==========================================

    const user =
      await User.create({

        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        role,

        // ====================================
        // GENERAL INFORMATION
        // ====================================

        phone: phone
          ? phone.trim()
          : "",

        gender:
          gender || "",

        dateOfBirth:
          dateOfBirth || null,

        nationality:
          nationality
            ? nationality.trim()
            : "",

        address:
          address
            ? address.trim()
            : "",

        bio:
          bio
            ? bio.trim()
            : "",

        avatar:
          avatar || "",

        // ====================================
        // PARENT / GUARDIAN
        // ====================================

        parentPhone:
          role === "student"
            ? parentPhone.trim()
            : "",

        guardianPhone:
          role === "student"
            ? guardianPhone.trim()
            : "",

        // ====================================
        // STATUS
        // ====================================

        status:
          status || "active",
      });

    // ==========================================
    // CREATE STUDENT PROFILE
    // ==========================================

    let student = null;

    if (
      role === "student"
    ) {

      // ========================================
      // GENERATE STUDENT ID
      // ========================================

      const studentId =
        await generateStudentId();

      // ========================================
      // SAVE STUDENT ID TO USER
      // ========================================

      user.studentId =
        studentId;

      await user.save();

      // ========================================
      // CREATE STUDENT PROFILE
      // ========================================

      student =
        await Student.create({

          // ==================================
          // USER LINK
          // ==================================

          user:
            user._id,

          // ==================================
          // STUDENT ID
          // ==================================

          studentId,

          // ==================================
          // PROGRAM
          // ==================================

          program:
            program.trim(),

          // ==================================
          // COHORT
          // ==================================

          cohort:
            cohort.trim(),

          // ==================================
          // PHONE
          // ==================================

          phone:
            phone
              ? phone.trim()
              : "",

          // ==================================
          // ADDRESS
          // ==================================

          address:
            address
              ? address.trim()
              : "",

          // ==================================
          // AVATAR
          // ==================================

          avatar:
            avatar || "",

          // ==================================
          // STUDENT STATUS
          // ==================================

          status:
            status === "inactive"
              ? "inactive"
              : "active",
        });
    }

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    res.status(201).json({

      message:
        "User created successfully.",

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
          user.studentId ||
          null,

        phone:
          user.phone ||
          "",

        parentPhone:
          user.parentPhone ||
          "",

        guardianPhone:
          user.guardianPhone ||
          "",

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
    });
  }
};

// ==========================================
// UPDATE USER
// PUT /api/users/:id
// ==========================================

const updateUser = async (
  req,
  res
) => {
  try {

    const { id } =
      req.params;

    const {
      name,
      email,
      password,
      role,

      phone,
      gender,
      dateOfBirth,
      nationality,
      address,
      bio,
      avatar,

      program,
      cohort,

      parentPhone,
      guardianPhone,

      status,

    } = req.body;

    // ==========================================
    // FIND USER
    // ==========================================

    const user =
      await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message:
          "User not found.",
      });
    }

    // ==========================================
    // DETERMINE FINAL ROLE
    // ==========================================

    const finalRole =
      role !== undefined
        ? role
        : user.role;

    // ==========================================
    // VALIDATE ROLE
    // ==========================================

    if (
      ![
        "admin",
        "student",
        "instructor",
      ].includes(finalRole)
    ) {
      return res.status(400).json({
        message:
          "Invalid user role.",
      });
    }

    // ==========================================
    // VALIDATE STATUS
    // ==========================================

    if (
      status !== undefined &&
      ![
        "active",
        "inactive",
        "suspended",
      ].includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid user status.",
      });
    }

    // ==========================================
    // STUDENT VALIDATION
    // ==========================================

    if (
      finalRole === "student"
    ) {

      const finalParentPhone =
        parentPhone !== undefined
          ? parentPhone
          : user.parentPhone;

      const finalGuardianPhone =
        guardianPhone !== undefined
          ? guardianPhone
          : user.guardianPhone;

      const finalProgram =
        program !== undefined
          ? program
          : null;

      const finalCohort =
        cohort !== undefined
          ? cohort
          : null;

      // ========================================
      // PARENT PHONE
      // ========================================

      if (
        !finalParentPhone ||
        !finalParentPhone.trim()
      ) {
        return res.status(400).json({
          message:
            "Parent phone number is required for students.",
        });
      }

      // ========================================
      // GUARDIAN PHONE
      // ========================================

      if (
        !finalGuardianPhone ||
        !finalGuardianPhone.trim()
      ) {
        return res.status(400).json({
          message:
            "Guardian phone number is required for students.",
        });
      }

      // ========================================
      // PROGRAM
      // ========================================

      if (
        finalProgram !== null &&
        finalProgram !== undefined &&
        !finalProgram.trim()
      ) {
        return res.status(400).json({
          message:
            "Program cannot be empty for students.",
        });
      }

      // ========================================
      // COHORT
      // ========================================

      if (
        finalCohort !== null &&
        finalCohort !== undefined &&
        !finalCohort.trim()
      ) {
        return res.status(400).json({
          message:
            "Cohort cannot be empty for students.",
        });
      }
    }

    // ==========================================
    // CHECK EMAIL
    // ==========================================

    if (email) {

      const normalizedEmail =
        email.toLowerCase().trim();

      const existingUser =
        await User.findOne({
          email:
            normalizedEmail,

          _id: {
            $ne: id,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "Email already exists.",
        });
      }

      user.email =
        normalizedEmail;
    }

    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    if (
      name !== undefined
    ) {
      user.name =
        name.trim();
    }

    if (
      role !== undefined
    ) {
      user.role =
        role;
    }

    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    if (
      phone !== undefined
    ) {
      user.phone =
        phone.trim();
    }

    if (
      gender !== undefined
    ) {
      user.gender =
        gender;
    }

    if (
      dateOfBirth !== undefined
    ) {
      user.dateOfBirth =
        dateOfBirth || null;
    }

    if (
      nationality !== undefined
    ) {
      user.nationality =
        nationality.trim();
    }

    if (
      address !== undefined
    ) {
      user.address =
        address.trim();
    }

    if (
      bio !== undefined
    ) {
      user.bio =
        bio.trim();
    }

    if (
      avatar !== undefined
    ) {
      user.avatar =
        avatar;
    }

    // ==========================================
    // PARENT / GUARDIAN
    // ==========================================

    if (
      parentPhone !== undefined
    ) {
      user.parentPhone =
        parentPhone.trim();
    }

    if (
      guardianPhone !== undefined
    ) {
      user.guardianPhone =
        guardianPhone.trim();
    }

    // ==========================================
    // STATUS
    // ==========================================

    if (
      status !== undefined
    ) {
      user.status =
        status;
    }

    // ==========================================
    // PASSWORD
    // ==========================================

    if (
      password &&
      password.trim() !== ""
    ) {
      user.password =
        await bcrypt.hash(
          password,
          10
        );
    }

    // ==========================================
    // STUDENT PROFILE
    // ==========================================

    let student = null;

    if (
      user.role === "student"
    ) {

      student =
        await Student.findOne({
          user:
            user._id,
        });

      // ========================================
      // CREATE PROFILE IF IT DOES NOT EXIST
      // ========================================

      if (!student) {

        const studentId =
          user.studentId ||
          await generateStudentId();

        user.studentId =
          studentId;

        student =
          await Student.create({

            user:
              user._id,

            studentId,

            program:
              program
                ? program.trim()
                : "",

            cohort:
              cohort
                ? cohort.trim()
                : "",

            phone:
              phone
                ? phone.trim()
                : "",

            address:
              address
                ? address.trim()
                : "",

            avatar:
              avatar || "",

            status:
              status === "inactive"
                ? "inactive"
                : "active",
          });

      } else {

        // ======================================
        // UPDATE EXISTING STUDENT PROFILE
        // ======================================

        if (
          program !== undefined
        ) {
          student.program =
            program.trim();
        }

        if (
          cohort !== undefined
        ) {
          student.cohort =
            cohort.trim();
        }

        if (
          phone !== undefined
        ) {
          student.phone =
            phone.trim();
        }

        if (
          address !== undefined
        ) {
          student.address =
            address.trim();
        }

        if (
          avatar !== undefined
        ) {
          student.avatar =
            avatar;
        }

        if (
          status !== undefined
        ) {
          student.status =
            status === "inactive"
              ? "inactive"
              : "active";
        }

        await student.save();
      }
    }

    // ==========================================
    // SAVE USER
    // ==========================================

    await user.save();

    // ==========================================
    // REMOVE PASSWORD FROM RESPONSE
    // ==========================================

    const userResponse =
      user.toObject();

    delete userResponse.password;

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    res.status(200).json({

      message:
        "User updated successfully.",

      user:
        userResponse,

      student,

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

const changeUserRole = async (
  req,
  res
) => {
  try {

    const { role } =
      req.body;

    // ==========================================
    // VALIDATE ROLE
    // ==========================================

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

    // ==========================================
    // FIND USER
    // ==========================================

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

    // ==========================================
    // PREVENT INVALID STUDENT CONVERSION
    // ==========================================

    if (
      role === "student"
    ) {

      if (
        !user.parentPhone ||
        !user.parentPhone.trim()
      ) {
        return res.status(400).json({
          message:
            "Parent phone number is required before changing this user to a student.",
        });
      }

      if (
        !user.guardianPhone ||
        !user.guardianPhone.trim()
      ) {
        return res.status(400).json({
          message:
            "Guardian phone number is required before changing this user to a student.",
        });
      }
    }

    user.role =
      role;

    await user.save();

    // ==========================================
    // SUCCESS RESPONSE
    // ==========================================

    const userResponse =
      user.toObject();

    delete userResponse.password;

    res.status(200).json({

      message:
        "Role updated successfully.",

      user:
        userResponse,

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

const changeUserStatus =
  async (
    req,
    res
  ) => {
    try {

      const { status } =
        req.body;

      // ==========================================
      // VALIDATE STATUS
      // ==========================================

      if (
        ![
          "active",
          "inactive",
          "suspended",
        ].includes(status)
      ) {
        return res.status(400).json({
          message:
            "Invalid user status.",
        });
      }

      // ==========================================
      // FIND USER
      // ==========================================

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

      // ==========================================
      // UPDATE USER STATUS
      // ==========================================

      user.status =
        status;

      await user.save();

      // ==========================================
      // KEEP STUDENT PROFILE STATUS IN SYNC
      // ==========================================

      if (
        user.role === "student"
      ) {

        const student =
          await Student.findOne({
            user:
              user._id,
          });

        if (student) {

          /*
           * Student model only supports:
           * active / inactive.
           *
           * suspended users remain active
           * in the Student profile because
           * suspension is controlled by the
           * User account.
           */

          student.status =
            status === "inactive"
              ? "inactive"
              : "active";

          await student.save();
        }
      }

      // ==========================================
      // REMOVE PASSWORD
      // ==========================================

      const userResponse =
        user.toObject();

      delete userResponse.password;

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      return res.status(200).json({

        message:
          status === "suspended"
            ? "User suspended successfully."
            : status === "active"
            ? "User reactivated successfully."
            : "User status updated successfully.",

        user:
          userResponse,

      });

    } catch (error) {

      console.error(
        "Change status error:",
        error
      );

      return res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

// ==========================================
// GET ALL INSTRUCTORS
// GET /api/users/instructors
// ==========================================

const getInstructors =
  async (
    req,
    res
  ) => {
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

const deleteUser =
  async (
    req,
    res
  ) => {
    try {

      const { id } =
        req.params;

      // ==========================================
      // FIND USER
      // ==========================================

      const user =
        await User.findById(id);

      if (!user) {
        return res.status(404).json({
          message:
            "User not found.",
        });
      }

      // ==========================================
      // DELETE STUDENT PROFILE
      // ==========================================

      if (
        user.role === "student"
      ) {

        await Student.findOneAndDelete({
          user:
            user._id,
        });
      }

      // ==========================================
      // DELETE USER
      // ==========================================

      await user.deleteOne();

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

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