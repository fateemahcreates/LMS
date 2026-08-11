const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Student = require("../models/Student");

const {
  notifyUser,
} = require("../services/notificationService");

// ==========================================
// ENROLL IN COURSE
// POST /api/enrollments
// Student
// ==========================================

const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // ======================================
    // VALIDATE COURSE
    // ======================================

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // ======================================
    // FIND STUDENT PROFILE
    // ======================================

    const student = await Student.findOne({
      user: req.user._id,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found.",
      });
    }

    // ======================================
    // PREVENT DUPLICATE ENROLLMENT
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
    // CALCULATE END DATE
    // ======================================

    const startDate = new Date();

    const endDate = new Date(startDate);

    const duration =
      course.duration || "12 Weeks";

    const value = parseInt(duration);

    if (
      duration
        .toLowerCase()
        .includes("week")
    ) {
      endDate.setDate(
        endDate.getDate() + value * 7
      );
    } else if (
      duration
        .toLowerCase()
        .includes("month")
    ) {
      endDate.setMonth(
        endDate.getMonth() + value
      );
    } else if (
      duration
        .toLowerCase()
        .includes("day")
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
    // CREATE ENROLLMENT
    // ======================================

    const enrollment =
      await Enrollment.create({
        student: req.user._id,

        course: course._id,

        instructor:
          course.instructorUser,

        startDate,

        endDate,

        progress: 0,

        status: "Enrolled",

        currentModule:
          "Introduction",

        lastActivity: new Date(),
      });

    // ======================================
    // ADD STUDENT TO COURSE
    // ======================================
    //
    // Course.students stores Student._id
    //
    // Enrollment.student stores User._id
    //
    // Therefore we use the Student profile.
    // ======================================

    const alreadyInCourse =
      course.students.some(
        (studentId) =>
          studentId.toString() ===
          student._id.toString()
      );

    if (!alreadyInCourse) {
      course.students.push(
        student._id
      );

      await course.save();
    }

    // ======================================
    // NOTIFY STUDENT
    // ======================================
    //
    // The student receives an in-app
    // notification confirming enrollment.
    //
    // Email will also be attempted according
    // to the student's notification settings.
    // ======================================

    try {
      await notifyUser({
        recipient: req.user._id,

        type: "enrollment",

        title:
          "Course Enrollment Successful",

        message:
          `You have successfully enrolled in "${course.title}". Your course is now available in My Courses.`,

        link:
          "/student/my-courses",

        relatedId:
          course._id,

        relatedModel:
          "Course",

        priority:
          "normal",

        sendEmailNotification:
          true,
      });

      console.log(
        `Student enrollment notification created for user ${req.user._id}`
      );

    } catch (notificationError) {

      // ====================================
      // IMPORTANT
      // ====================================
      //
      // Notification failure must NOT cause
      // the enrollment itself to fail.
      // ====================================

      console.error(
        "Student enrollment notification error:",
        notificationError
      );
    }

    // ======================================
    // NOTIFY INSTRUCTOR
    // ======================================
    //
    // If the course has an instructor,
    // notify the instructor that a new
    // student has enrolled.
    // ======================================

    if (course.instructorUser) {
      try {
        await notifyUser({
          recipient:
            course.instructorUser,

          type:
            "enrollment",

          title:
            "New Student Enrollment",

          message:
            `${student.name || "A student"} has enrolled in "${course.title}".`,

          link:
            `/instructor/courses/${course._id}/students`,

          relatedId:
            course._id,

          relatedModel:
            "Course",

          priority:
            "normal",

          sendEmailNotification:
            true,
        });

        console.log(
          `Instructor enrollment notification created for user ${course.instructorUser}`
        );

      } catch (notificationError) {

        // ====================================
        // Notification failure should not
        // break successful enrollment.
        // ====================================

        console.error(
          "Instructor enrollment notification error:",
          notificationError
        );
      }
    }

    // ======================================
    // POPULATE ENROLLMENT
    // ======================================

    const populatedEnrollment =
      await Enrollment.findById(
        enrollment._id
      )
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

    // ======================================
    // RETURN ENROLLMENT
    // ======================================

    res.status(201).json({
      message:
        "Course enrolled successfully.",

      enrollment:
        populatedEnrollment,
    });

  } catch (error) {

    console.error(
      "Enroll course error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
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
    const enrollments =
      await Enrollment.find({
        student: req.user._id,
      })
        .populate("course")
        .sort({
          createdAt: -1,
        });

    const validEnrollments =
      enrollments.filter(
        (enrollment) =>
          enrollment.course
      );

    const today = new Date();

    const data =
      validEnrollments.map(
        (enrollment) => {
          const startDate =
            enrollment.startDate
              ? new Date(
                  enrollment.startDate
                )
              : new Date(
                  enrollment.createdAt
                );

          const endDate =
            enrollment.endDate
              ? new Date(
                  enrollment.endDate
                )
              : new Date(startDate);

          const totalDays =
            Math.max(
              1,
              Math.ceil(
                (endDate - startDate) /
                  (1000 *
                    60 *
                    60 *
                    24)
              )
            );

          const daysCompleted =
            Math.min(
              totalDays,
              Math.max(
                0,
                Math.ceil(
                  (today - startDate) /
                    (1000 *
                      60 *
                      60 *
                      24)
                )
              )
            );

          const daysRemaining =
            Math.max(
              0,
              Math.ceil(
                (endDate - today) /
                  (1000 *
                    60 *
                    60 *
                    24)
              )
            );

          const progress =
            Math.min(
              100,
              Math.max(
                0,
                Math.round(
                  (daysCompleted /
                    totalDays) *
                    100
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
        }
      );

    res.json(data);

  } catch (error) {

    console.error(
      "Get my courses error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// ==========================================
// CONTINUE LEARNING
// PATCH /api/enrollments/:id/progress
// Student
// ==========================================

const updateEnrollmentProgress =
  async (req, res) => {
    try {
      const enrollment =
        await Enrollment.findOne({
          _id: req.params.id,

          student:
            req.user._id,
        });

      if (!enrollment) {
        return res.status(404).json({
          message:
            "Enrollment not found.",
        });
      }

      if (enrollment.progress < 100) {
        enrollment.progress += 25;

        if (
          enrollment.progress >=
          100
        ) {
          enrollment.progress = 100;

          enrollment.status =
            "Completed";

          enrollment.completedAt =
            new Date();
        } else {
          enrollment.status =
            "In Progress";
        }
      }

      enrollment.lastActivity =
        new Date();

      await enrollment.save();

      res.json(enrollment);

    } catch (error) {

      console.error(
        "Update enrollment progress error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==========================================
// INSTRUCTOR DASHBOARD
// GET /api/enrollments/instructor/dashboard
// Instructor Only
// ==========================================

const getInstructorDashboard =
  async (req, res) => {
    try {

      // ======================================
      // COURSES OWNED BY INSTRUCTOR
      // ======================================

      const courses =
        await Course.find({
          instructorUser:
            req.user._id,
        });

      const courseIds =
        courses.map(
          (course) =>
            course._id
        );

      // ======================================
      // ENROLLMENTS
      // ======================================

      const enrollments =
        await Enrollment.find({
          course: {
            $in: courseIds,
          },
        })
          .populate(
            "student",
            "name email"
          )
          .populate(
            "course",
            "title code category"
          );

      // ======================================
      // STATISTICS
      // ======================================

      const totalCourses =
        courses.length;

      const totalStudents =
        enrollments.length;

      const completedStudents =
        enrollments.filter(
          (e) =>
            e.status ===
            "Completed"
        ).length;

      const inProgress =
        enrollments.filter(
          (e) =>
            e.status ===
              "Enrolled" ||
            e.status ===
              "In Progress"
        ).length;

      // ======================================
      // RECENT ENROLLMENTS
      // ======================================

      const recentEnrollments =
        enrollments
          .sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
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

      console.error(
        "Get instructor dashboard error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==========================================
// GET STUDENTS FOR A COURSE
// GET /api/enrollments/instructor/course/:courseId/students
// Instructor Only
// ==========================================

const getInstructorCourseStudents =
  async (req, res) => {
    try {
      const {
        courseId,
      } = req.params;

      // ======================================
      // VERIFY COURSE EXISTS
      // ======================================

      const course =
        await Course.findById(
          courseId
        );

      if (!course) {
        return res.status(404).json({
          message:
            "Course not found.",
        });
      }

      // ======================================
      // INSTRUCTOR OWNERSHIP CHECK
      // ======================================

      if (
        course.instructorUser.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "Access denied.",
        });
      }

      // ======================================
      // GET ENROLLED STUDENTS
      // ======================================

      const enrollments =
        await Enrollment.find({
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
          _id:
            course._id,

          title:
            course.title,

          code:
            course.code,
        },

        totalStudents:
          enrollments.length,

        students:
          enrollments,
      });

    } catch (error) {

      console.error(
        "Get instructor course students error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==========================================
// GET ALL ENROLLMENTS
// Admin Only
// ==========================================

const getAllEnrollments =
  async (req, res) => {
    try {

      const enrollments =
        await Enrollment.find()
          .populate(
            "student",
            "name email"
          )
          .populate(
            "course",
            "title category duration"
          )
          .sort({
            createdAt: -1,
          });

      const today =
        new Date();

      const data =
        enrollments
          .filter(
            (enrollment) =>
              enrollment.student &&
              enrollment.course
          )
          .map(
            (enrollment) => {

              const startDate =
                enrollment.startDate
                  ? new Date(
                      enrollment.startDate
                    )
                  : new Date(
                      enrollment.createdAt
                    );

              const endDate =
                enrollment.endDate
                  ? new Date(
                      enrollment.endDate
                    )
                  : new Date(
                      startDate
                    );

              const totalDays =
                Math.max(
                  1,
                  Math.ceil(
                    (endDate -
                      startDate) /
                      (1000 *
                        60 *
                        60 *
                        24)
                  )
                );

              const daysCompleted =
                Math.min(
                  totalDays,
                  Math.max(
                    0,
                    Math.ceil(
                      (today -
                        startDate) /
                        (1000 *
                          60 *
                          60 *
                          24)
                    )
                  )
                );

              const daysRemaining =
                Math.max(
                  0,
                  Math.ceil(
                    (endDate -
                      today) /
                      (1000 *
                        60 *
                        60 *
                        24)
                  )
                );

              const progress =
                Math.min(
                  100,
                  Math.max(
                    0,
                    Math.round(
                      (daysCompleted /
                        totalDays) *
                        100
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
            }
          );

      res.json(data);

    } catch (error) {

      console.error(
        "Get all enrollments error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==========================================
// UNENROLL FROM COURSE
// DELETE /api/enrollments/:id
// Student Only
// ==========================================

const removeEnrollment =
  async (req, res) => {
    try {

      // ======================================
      // FIND ENROLLMENT BELONGING TO USER
      // ======================================

      const enrollment =
        await Enrollment.findOne({
          _id: req.params.id,

          student:
            req.user._id,
        });

      if (!enrollment) {
        return res.status(404).json({
          message:
            "Enrollment not found.",
        });
      }

      // ======================================
      // REMOVE STUDENT FROM COURSE
      // ======================================

      const course =
        await Course.findById(
          enrollment.course
        );

      if (course) {

        const student =
          await Student.findOne({
            user:
              req.user._id,
          });

        if (student) {

          course.students =
            course.students.filter(
              (studentId) =>
                studentId.toString() !==
                student._id.toString()
            );

          await course.save();
        }
      }

      // ======================================
      // DELETE ENROLLMENT
      // ======================================

      await Enrollment.deleteOne({
        _id:
          enrollment._id,
      });

      res.json({
        message:
          "Course enrollment removed successfully.",
      });

    } catch (error) {

      console.error(
        "Remove enrollment error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==========================================
// APPROVE CERTIFICATE
// Admin Only
// ==========================================

const approveCertificate =
  async (req, res) => {
    try {

      const enrollment =
        await Enrollment.findById(
          req.params.id
        );

      if (!enrollment) {
        return res.status(404).json({
          message:
            "Enrollment not found.",
        });
      }

      if (
        enrollment.progress < 100
      ) {
        return res.status(400).json({
          message:
            "Course not completed yet.",
        });
      }

      enrollment.certificateApproved =
        true;

      await enrollment.save();

      res.json({
        message:
          "Certificate approved successfully.",

        enrollment,
      });

    } catch (error) {

      console.error(
        "Approve certificate error:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ==========================================
// SYNC COURSE STUDENTS
// ==========================================
//
// Useful for existing enrollments.
//
// Enrollment.student = User._id
//
// Course.students = Student._id
//
// This converts existing enrollments
// into Course.students entries.
// ==========================================

const syncCourseStudents =
  async (courseId) => {
    try {

      const course =
        await Course.findById(
          courseId
        );

      if (!course) {
        return null;
      }

      const enrollments =
        await Enrollment.find({
          course:
            courseId,
        }).select(
          "student"
        );

      const studentUserIds =
        enrollments.map(
          (enrollment) =>
            enrollment.student
        );

      const students =
        await Student.find({
          user: {
            $in:
              studentUserIds,
          },
        }).select(
          "_id"
        );

      course.students =
        students.map(
          (student) =>
            student._id
        );

      await course.save();

      console.log(
        `Course "${course.title}" synchronized with ${students.length} student(s).`
      );

      return course;

    } catch (error) {

      console.error(
        "Sync course students error:",
        error
      );

      throw error;
    }
  };

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  enrollCourse,

  getMyCourses,

  updateEnrollmentProgress,

  removeEnrollment,

  getAllEnrollments,

  approveCertificate,

  getInstructorDashboard,

  getInstructorCourseStudents,

  syncCourseStudents,
};