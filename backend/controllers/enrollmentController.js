const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ==========================================
// ENROLL IN COURSE
// POST /api/enrollments
// Student
// ==========================================

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // ======================================
    // Validate Course
    // ======================================

    const course = await Course.findById(courseId)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // ======================================
    // Prevent Duplicate Enrollment
    // ======================================

    const existingEnrollment =
      await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      });

    if (existingEnrollment) {
      return res.status(400).json({
        message:
          "You are already enrolled in this course.",
      });
    }

    // ======================================
    // Calculate End Date
    // ======================================

    const startDate = new Date();

    const endDate = new Date(startDate);

    const duration = course.duration || "12 Weeks";

    const value = parseInt(duration);

    if (
      duration.toLowerCase().includes("week")
    ) {
      endDate.setDate(
        endDate.getDate() + value * 7
      );
    } else if (
      duration.toLowerCase().includes("month")
    ) {
      endDate.setMonth(
        endDate.getMonth() + value
      );
    } else if (
      duration.toLowerCase().includes("day")
    ) {
      endDate.setDate(
        endDate.getDate() + value
      );
    } else {
      endDate.setDate(
        endDate.getDate() + 84
      );
    }

    // ======================================
    // Create Enrollment
    // ======================================

    const enrollment =
      await Enrollment.create({
        student: req.user._id,

        course: course._id,

        instructor: course.instructor._id,

        startDate,

        endDate,

        progress: 0,

        status: "Enrolled",

        currentModule: "Introduction",

        lastActivity: new Date(),
      });

    // ======================================
    // Return Enrollment
    // ======================================

    const populatedEnrollment =
      await Enrollment.findById(enrollment._id)
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "title code category"
        )
        .populate(
          "instructor",
          "name email"
        );

    res.status(201).json({
      message:
        "Course enrolled successfully.",

      enrollment: populatedEnrollment,
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

    const today = new Date();

    const data = enrollments.map((enrollment) => {
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

      const daysRemaining = Math.max(
        0,
        Math.ceil(
          (endDate - today) /
            (1000 * 60 * 60 * 24)
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

      return {
        ...enrollment.toObject(),
        progress,
        totalDays,
        daysCompleted,
        daysRemaining,
      };
    });

    res.json(data);

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

const updateEnrollmentProgress = async (req, res) => {
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
// INSTRUCTOR DASHBOARD
// GET /api/enrollments/instructor/dashboard
// ==========================================

const getInstructorDashboard = async (req, res) => {
  try {
    // ===============================
    // Courses owned by instructor
    // ===============================

    const courses = await Course.find({
      instructor: req.user._id,
    });

    const courseIds = courses.map(course => course._id);

    // ===============================
    // Enrollments
    // ===============================

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name email")
      .populate("course", "title code category");

    // ===============================
    // Statistics
    // ===============================

    const totalCourses = courses.length;

    const totalStudents = enrollments.length;

    const completedStudents = enrollments.filter(
      e => e.status === "Completed"
    ).length;

    const inProgress = enrollments.filter(
      e =>
        e.status === "Enrolled" ||
        e.status === "In Progress"
    ).length;

    // ===============================
    // Recent Enrollments
    // ===============================

    const recentEnrollments = enrollments
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 5);

    res.json({
      stats: {
        totalCourses,
        totalStudents,
        completedStudents,
        inProgress,
      },

      recentEnrollments,

      courses,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// GET STUDENTS FOR A COURSE
// GET /api/enrollments/instructor/course/:courseId/students
// ==========================================
const getInstructorCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    // ======================================
    // Verify Course Exists
    // ======================================

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // ======================================
    // Instructor Ownership Check
    // ======================================

    if (
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied.",
      });
    }

    // ======================================
    // Get Enrolled Students
    // ======================================

    const enrollments = await Enrollment.find({
      course: courseId,
    })
      .populate(
        "student",
        "name email studentId"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      course: {
        _id: course._id,
        title: course.title,
        code: course.code,
      },

      totalStudents: enrollments.length,

      students: enrollments,
    });

  } catch (error) {

    console.error(error);

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
      .populate(
        "course",
        "title category duration"
      )
      .sort({
        createdAt: -1,
      });

    const today = new Date();

   const data = enrollments
  .filter(
    (enrollment) =>
      enrollment.student &&
      enrollment.course
  )
  .map((enrollment) => {
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

      const daysRemaining = Math.max(
        0,
        Math.ceil(
          (endDate - today) /
            (1000 * 60 * 60 * 24)
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

      return {
        ...enrollment.toObject(),
        progress,
        totalDays,
        daysCompleted,
        daysRemaining,
      };
    });

    res.json(data);

  } catch (error) {
    console.error(error);

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
  updateEnrollmentProgress,
  removeEnrollment,
  getAllEnrollments,
  approveCertificate,
  getInstructorDashboard,
  getInstructorCourseStudents,
};