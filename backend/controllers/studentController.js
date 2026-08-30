const Student = require("../models/Student");
const User = require("../models/User");

const bcrypt = require("bcryptjs");

const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");
const Certificate = require("../models/Certificate");

// ==========================================
// CREATE STUDENT
// ==========================================
// ==========================================
// CREATE STUDENT
// ==========================================

const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      program,
      phone,
    } = req.body;

    // ==========================================
    // VALIDATE REQUIRED FIELDS
    // ==========================================

    if (
      !name ||
      !email ||
      !password ||
      !program
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // ==========================================
    // CHECK EMAIL
    // ==========================================

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // ==========================================
    // GENERATE STUDENT ID
    // ==========================================

    const currentYear = new Date().getFullYear();

    let studentNumber = 1;
    let studentId;

    while (true) {
      studentId = `GMT-STU-${currentYear}-${String(
        studentNumber
      ).padStart(6, "0")}`;

      const existingStudent =
        await Student.findOne({
          studentId,
        });

      if (!existingStudent) {
        break;
      }

      studentNumber++;
    }

    // ==========================================
    // HASH PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // ==========================================
    // CREATE USER
    // ==========================================

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      status: "active",
    });

    // ==========================================
    // CREATE STUDENT
    // ==========================================

    const student = await Student.create({
      user: user._id,
      studentId,
      program,
      phone,
    });

    // ==========================================
    // POPULATE STUDENT
    // ==========================================

    const populatedStudent =
      await Student.findById(student._id)
        .populate(
          "user",
          "name email role"
        );

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({
      message:
        "Student created successfully.",
      student: populatedStudent,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET ALL STUDENTS
// ==========================================

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("user", "name email role")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(students);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET LOGGED-IN STUDENT PROFILE
// ==========================================

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({
      user: req.user._id,
    }).populate(
      "user",
      "name email role"
    );

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found.",
      });
    }

    res.status(200).json(student);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// UPDATE STUDENT PROFILE
// ==========================================

const updateStudentProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      program,
    } = req.body;

    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found.",
      });
    }

    await User.findByIdAndUpdate(
      student.user,
      {
        name,
      }
    );

    student.phone = phone;
    student.program = program;

    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate(
        "user",
        "name email role"
      );

    res.status(200).json({
      message: "Profile updated successfully.",
      student: updatedStudent,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET STUDENT DASHBOARD STATS
// ==========================================

const getStudentStats = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    }).populate("course");

    const today = new Date();

    const activeProgramme = enrollments.filter(
      (item) =>
        item.status === "Enrolled" ||
        item.status === "In Progress"
    ).length;

    let totalProgress = 0;

    enrollments.forEach((enrollment) => {
      const startDate = enrollment.startDate
        ? new Date(enrollment.startDate)
        : new Date(enrollment.createdAt);

      const endDate = enrollment.endDate
        ? new Date(enrollment.endDate)
        : new Date(startDate);

      const totalDays = Math.max(
        1,
        Math.ceil(
          (endDate - startDate) /
            (1000 * 60 * 60 * 24)
        )
      );

      const daysCompleted = Math.min(
        totalDays,
        Math.max(
          0,
          Math.ceil(
            (today - startDate) /
              (1000 * 60 * 60 * 24)
          )
        )
      );

      const progress = Math.min(
        100,
        Math.max(
          0,
          Math.round(
            (daysCompleted / totalDays) * 100
          )
        )
      );

      totalProgress += progress;
    });

    const programmeProgress =
      enrollments.length > 0
        ? Math.round(
            totalProgress / enrollments.length
          )
        : 0;

    const courseIds = enrollments.map(
      (item) => item.course._id
    );

    const pendingAssignments =
      await Assignment.countDocuments({
        course: {
          $in: courseIds,
        },
        status: "Active",
      });

    const certificates = enrollments.filter(
      (item) => item.certificateApproved
    ).length;

    res.json({
      activeProgramme,
      pendingAssignments,
      programmeProgress,
      certificates,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// UPDATE STUDENT (ADMIN)
// ==========================================

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      studentId,
      program,
      phone,
    } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    await User.findByIdAndUpdate(
      student.user,
      {
        name,
        email,
      }
    );

    student.studentId = studentId;
    student.program = program;
    student.phone = phone;

    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate(
        "user",
        "name email role"
      );

    res.status(200).json({
      message: "Student updated successfully.",
      student: updatedStudent,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// DELETE STUDENT
// ==========================================

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(id);

    res.status(200).json({
      message: "Student deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentStats,
};