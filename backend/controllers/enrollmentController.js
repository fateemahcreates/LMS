const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ==========================================
// ENROLL IN A COURSE
// POST /api/enrollments
// Student Only
// ==========================================
const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // Prevent duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "You are already enrolled in this course.",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json({
      message: "Course enrolled successfully.",
      enrollment,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET MY COURSES
// GET /api/enrollments/my
// Student Only
// ==========================================
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate("course")
      .sort({
        createdAt: -1,
      });

    res.json(enrollments);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===========================================
// CONTINUE LEARNING
// ===========================================

const continueLearning = async (req, res) => {
  try {

    const enrollment =
      await Enrollment.findOne({
        _id: req.params.id,
        student: req.user._id,
      });

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found.",
      });
    }

    if (enrollment.progress < 100) {
      enrollment.progress += 25;

      if (enrollment.progress >= 100) {
        enrollment.progress = 100;

        enrollment.status = "Completed";

        enrollment.completedAt = new Date();
      } else {
        enrollment.status = "In Progress";
      }
    }

    await enrollment.save();

    res.json(enrollment);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL ENROLLMENTS
// Admin Only
// ==========================================
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "title category")
      .sort({ createdAt: -1 });

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UNENROLL FROM COURSE
// DELETE /api/enrollments/:id
// Student Only
// ==========================================
const removeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user._id,
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found.",
      });
    }

    await enrollment.deleteOne();

    res.json({
      message: "Course removed successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// APPROVE CERTIFICATE
// Admin Only
// ==========================================
const approveCertificate = async (req, res) => {
  try {

    const enrollment = await Enrollment.findById(
      req.params.id
    );

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found.",
      });
    }

    if (enrollment.progress < 100) {
      return res.status(400).json({
        message: "Course not completed yet.",
      });
    }

    enrollment.certificateApproved = true;

    await enrollment.save();

    res.json({
      message: "Certificate approved successfully.",
      enrollment,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



module.exports = {
  enrollCourse,
  getMyCourses,
  continueLearning,
  removeEnrollment,
  getAllEnrollments,
  approveCertificate,
};