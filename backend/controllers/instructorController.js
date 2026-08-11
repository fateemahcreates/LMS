const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Announcement = require("../models/Announcement");
const Enrollment = require("../models/Enrollment");

// ======================================
// Instructor Dashboard
// ======================================

const getInstructorDashboard = async (req, res) => {
  try {
    // Courses belonging to instructor
    const courses = await Course.find({
      instructorUser: req.user._id,
    });

    const totalCourses = courses.length;

    // Total students
    let totalStudents = 0;

    courses.forEach((course) => {
      totalStudents += course.students.length;
    });

    // Assignments
    const totalAssignments =
      await Assignment.countDocuments({
        instructor: req.user._id,
      });

    // Announcements
    const totalAnnouncements =
      await Announcement.countDocuments({
        instructor: req.user._id,
      });

    res.status(200).json({
      totalCourses,
      totalStudents,
      totalAssignments,
      totalAnnouncements,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET ALL STUDENTS FOR THIS INSTRUCTOR
// ==========================================

const getInstructorStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      instructor: req.user._id,
    })
      .populate(
        "student",
        "name email phone avatar"
      )
      .populate(
        "course",
        "title code category"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(enrollments);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getInstructorDashboard,
  getInstructorStudents,
};