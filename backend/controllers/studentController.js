const Student = require("../models/Student");
const User = require("../models/User");

const bcrypt = require("bcryptjs");

// ==========================================
// CREATE STUDENT
// ==========================================
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      department,
      faculty,
      level,
      semester,
      phone,
    } = req.body;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !studentId ||
      !department ||
      !level
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // Check student ID
    const existingStudent = await Student.findOne({
      studentId,
    });

    if (existingStudent) {
      return res.status(400).json({
        message: "Student ID already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
      status: "active",
    });

    // Create student profile
    const student = await Student.create({
      user: user._id,
      studentId,
      department,
      faculty,
      level,
      semester,
      phone,
    });

    const populatedStudent =
      await Student.findById(student._id).populate(
        "user",
        "name email role"
      );

    res.status(201).json({
      message: "Student created successfully.",
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
      .sort({ createdAt: -1 });

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
// GET /api/students/profile
// ==========================================

const getStudentProfile = async (req, res) => {

  try {

    const student = await Student.findOne({
      user: req.user._id
    })
    .populate(
      "user",
      "name email role"
    );


    if (!student) {

      return res.status(404).json({
        message: "Student profile not found."
      });

    }


    res.status(200).json(student);


  } catch(error){

    console.error(error);


    res.status(500).json({
      message:"Server Error"
    });

  }

};

// ==========================================
// UPDATE LOGGED-IN STUDENT PROFILE
// PUT /api/students/profile
// ==========================================

const updateStudentProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      department,
      faculty,
      level,
      semester,
    } = req.body;

    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found.",
      });
    }

    // Update User information
    await User.findByIdAndUpdate(student.user, {
      name,
    });

    // Update Student information
    student.phone = phone;
    student.department = department;
    student.faculty = faculty;
    student.level = level;
    student.semester = semester;

    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate("user", "name email role");

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
// GET /api/students/stats
// ==========================================

const getStudentStats = async (req, res) => {

  try {

    const student = await Student.findOne({
      user: req.user._id
    });


    if (!student) {

      return res.status(404).json({
        message:"Student not found"
      });

    }


    // Temporary values
    // Later connected to courses, attendance and results

    const stats = {

      enrolledCourses: 0,

      pendingAssignments: 0,

      attendance: "0%",

      gpa: "0.00"

    };


    res.status(200).json(stats);


  } catch(error){

    console.error(error);

    res.status(500).json({
      message:"Server Error"
    });

  }

};

// ==========================================
// UPDATE STUDENT
// ==========================================
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      studentId,
      department,
      faculty,
      level,
      semester,
      phone,
    } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    await User.findByIdAndUpdate(student.user, {
      name,
      email,
    });

    student.studentId = studentId;
    student.department = department;
    student.faculty = faculty;
    student.level = level;
    student.semester = semester;
    student.phone = phone;

    await student.save();

    const updatedStudent =
      await Student.findById(student._id).populate(
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