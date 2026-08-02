const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Announcement = require("../models/Announcement");

// ======================================
// Instructor Dashboard
// ======================================

const getInstructorDashboard = async (req, res) => {
  try {
    // Get all courses belonging to this instructor
    const courses = await Course.find({
      instructorUser: req.user._id,
    });

    const totalCourses = courses.length;

    // Count students across instructor courses
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

module.exports = {
  getInstructorDashboard,
};