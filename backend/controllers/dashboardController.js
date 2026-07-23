const Course = require("../models/Course");
const Student = require("../models/Student");

const getStudentDashboard = async (req, res) => {
  try {

    const student = await Student.findOne({
      user: req.user._id,
    }).populate("user");

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    const courses = await Course.find({
      students: student._id,
      status: "Published",
    });

    res.json({
      student,
      courses,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getStudentDashboard,
};