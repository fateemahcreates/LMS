const ClassSession = require("../models/ClassSession");
const Attendance = require("../models/Attendance");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// ======================================================
// CREATE CLASS SESSION
// POST /api/attendance/sessions
// Admin + Instructor
// ======================================================

const createClassSession = async (req, res) => {
  try {
    const {
      courseId,
      date,
      startTime,
      endTime,
      notes,
    } = req.body;

    // ==============================================
    // VALIDATE REQUIRED FIELDS
    // ==============================================

    if (
      !courseId ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message:
          "Course, date, start time and end time are required.",
      });
    }

    // ==============================================
    // FIND COURSE
    // ==============================================

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() === "instructor" &&
      course.instructorUser.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot create a class session for another instructor's course.",
      });
    }

    // ==============================================
    // PREVENT DUPLICATE SESSION
    // ==============================================

    const existingSession =
      await ClassSession.findOne({
        course: courseId,
        date: new Date(date),
        startTime,
      });

    if (existingSession) {
      return res.status(400).json({
        message:
          "A class session already exists for this course at this date and start time.",
      });
    }

    // ==============================================
    // CREATE SESSION
    // ==============================================

    const session =
      await ClassSession.create({
        course: courseId,

        instructor:
          course.instructorUser,

        date: new Date(date),

        startTime,

        endTime,

        status: "Scheduled",

        createdBy:
          req.user._id,

        notes:
          notes || "",
      });

    // ==============================================
    // POPULATE RESPONSE
    // ==============================================

    const populatedSession =
      await ClassSession.findById(
        session._id
      )
        .populate(
          "course",
          "title code category"
        )
        .populate(
          "instructor",
          "name email"
        )
        .populate(
          "createdBy",
          "name email role"
        );

    res.status(201).json({
      message:
        "Class session created successfully.",

      session:
        populatedSession,
    });

  } catch (error) {

    console.error(
      "Create class session error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// GET CLASS SESSIONS FOR A COURSE
// GET /api/attendance/sessions/course/:courseId
// Admin + Instructor
// ======================================================

const getCourseSessions = async (
  req,
  res
) => {
  try {

    const {
      courseId,
    } = req.params;

    // ==============================================
    // FIND COURSE
    // ==============================================

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

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "instructor" &&
      course.instructorUser.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot view sessions for another instructor's course.",
      });
    }

    // ==============================================
    // GET SESSIONS
    // ==============================================

    const sessions =
      await ClassSession.find({
        course:
          courseId,
      })
        .populate(
          "instructor",
          "name email"
        )
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({
          date: -1,
          startTime: -1,
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

      totalSessions:
        sessions.length,

      sessions,
    });

  } catch (error) {

    console.error(
      "Get course sessions error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// GET SESSION
// GET /api/attendance/sessions/:sessionId
// Admin + Instructor
// ======================================================

const getClassSession = async (
  req,
  res
) => {
  try {

    const {
      sessionId,
    } = req.params;

    const session =
      await ClassSession.findById(
        sessionId
      )
        .populate(
          "course",
          "title code category"
        )
        .populate(
          "instructor",
          "name email"
        )
        .populate(
          "createdBy",
          "name email role"
        );

    if (!session) {
      return res.status(404).json({
        message:
          "Class session not found.",
      });
    }

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "instructor" &&
      session.instructor._id.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot access another instructor's class session.",
      });
    }

    res.json({
      session,
    });

  } catch (error) {

    console.error(
      "Get class session error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// OPEN ATTENDANCE
// PATCH /api/attendance/sessions/:sessionId/open
// Admin + Instructor
// ======================================================

const openAttendance = async (
  req,
  res
) => {
  try {

    const {
      sessionId,
    } = req.params;

    const session =
      await ClassSession.findById(
        sessionId
      );

    if (!session) {
      return res.status(404).json({
        message:
          "Class session not found.",
      });
    }

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "instructor" &&
      session.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot open attendance for another instructor's session.",
      });
    }

    // ==============================================
    // PREVENT INVALID STATUS CHANGE
    // ==============================================

    if (
      session.status ===
      "Finalized"
    ) {
      return res.status(400).json({
        message:
          "This attendance session has already been finalized.",
      });
    }

    if (
      session.status ===
      "Cancelled"
    ) {
      return res.status(400).json({
        message:
          "This class session has been cancelled.",
      });
    }

    // ==============================================
    // OPEN SESSION
    // ==============================================

    session.status =
      "Open";

    await session.save();

    res.json({
      message:
        "Attendance is now open.",

      session,
    });

  } catch (error) {

    console.error(
      "Open attendance error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// GET ATTENDANCE ROSTER
// GET /api/attendance/sessions/:sessionId/roster
// Admin + Instructor
// ======================================================
//
// This is one of the most important functions.
//
// It gets all ACTIVE students enrolled in the course
// and combines them with any attendance records that
// already exist for this session.
//
// Students without a record are returned as:
// "Not Marked"
//
// They are NOT automatically considered absent.
// ======================================================

const getAttendanceRoster = async (
  req,
  res
) => {
  try {

    const {
      sessionId,
    } = req.params;

    // ==============================================
    // FIND SESSION
    // ==============================================

    const session =
      await ClassSession.findById(
        sessionId
      );

    if (!session) {
      return res.status(404).json({
        message:
          "Class session not found.",
      });
    }

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "instructor" &&
      session.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot view attendance for another instructor's session.",
      });
    }

    // ==============================================
    // GET ACTIVE ENROLLMENTS
    // ==============================================

    const enrollments =
      await Enrollment.find({
        course:
          session.course,

        status: {
          $in: [
            "Enrolled",
            "In Progress",
            "Completed",
          ],
        },
      })
        .populate(
          "student",
          "name email studentId"
        )
        .sort({
          createdAt: 1,
        });

    // ==============================================
    // GET EXISTING ATTENDANCE
    // ==============================================

    const attendanceRecords =
      await Attendance.find({
        session:
          session._id,
      }).populate(
        "markedBy",
        "name email role"
      );

    // ==============================================
    // CREATE ATTENDANCE LOOKUP
    // ==============================================

    const attendanceMap =
      new Map();

    attendanceRecords.forEach(
      (record) => {

        attendanceMap.set(
          record.student.toString(),
          record
        );

      }
    );

    // ==============================================
    // BUILD ROSTER
    // ==============================================

    const roster =
      enrollments.map(
        (enrollment) => {

          const student =
            enrollment.student;

          const attendance =
            attendanceMap.get(
              student._id.toString()
            );

          return {
            enrollmentId:
              enrollment._id,

            student: {
              _id:
                student._id,

              name:
                student.name,

              email:
                student.email,

              studentId:
                student.studentId,
            },

            status:
              attendance
                ? attendance.status
                : "Not Marked",

            attendanceId:
              attendance
                ? attendance._id
                : null,

            notes:
              attendance
                ? attendance.notes
                : "",

            markedAt:
              attendance
                ? attendance.markedAt
                : null,

            markedBy:
              attendance
                ? attendance.markedBy
                : null,
          };

        }
      );

    res.json({
      session: {
        _id:
          session._id,

        course:
          session.course,

        instructor:
          session.instructor,

        date:
          session.date,

        startTime:
          session.startTime,

        endTime:
          session.endTime,

        status:
          session.status,
      },

      totalStudents:
        roster.length,

      roster,
    });

  } catch (error) {

    console.error(
      "Get attendance roster error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// SAVE / UPDATE ATTENDANCE
// PUT /api/attendance/sessions/:sessionId
// Admin + Instructor
// ======================================================
//
// Receives an array:
//
// attendance: [
//   {
//     studentId: "...",
//     status: "Present"
//   }
// ]
//
// ======================================================

const saveAttendance = async (
  req,
  res
) => {
  try {

    const {
      sessionId,
    } = req.params;

    const {
      attendance,
    } = req.body;

    // ==============================================
    // VALIDATE REQUEST
    // ==============================================

    if (
      !Array.isArray(
        attendance
      )
    ) {
      return res.status(400).json({
        message:
          "Attendance must be provided as an array.",
      });
    }

    // ==============================================
    // FIND SESSION
    // ==============================================

    const session =
      await ClassSession.findById(
        sessionId
      );

    if (!session) {
      return res.status(404).json({
        message:
          "Class session not found.",
      });
    }

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "instructor" &&
      session.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot modify attendance for another instructor's session.",
      });
    }

    // ==============================================
    // ONLY OPEN SESSIONS CAN BE EDITED
    // ==============================================

    if (
      session.status !==
      "Open"
    ) {
      return res.status(400).json({
        message:
          "Attendance must be open before it can be recorded.",
      });
    }

    // ==============================================
    // GET ENROLLED STUDENTS
    // ==============================================

    const enrollments =
      await Enrollment.find({
        course:
          session.course,

        status: {
          $in: [
            "Enrolled",
            "In Progress",
            "Completed",
          ],
        },
      }).select(
        "student"
      );

    const allowedStudents =
      new Set(
        enrollments.map(
          (enrollment) =>
            enrollment.student.toString()
        )
      );

    // ==============================================
    // VALID STATUSES
    // ==============================================

    const validStatuses = [
      "Present",
      "Absent",
      "Late",
      "Excused",
    ];

    // ==============================================
    // PROCESS ATTENDANCE
    // ==============================================

    for (
      const record of attendance
    ) {

      const {
        studentId,
        status,
        notes,
      } = record;

      // ==========================================
      // VALIDATE STUDENT
      // ==========================================

      if (
        !studentId ||
        !allowedStudents.has(
          studentId.toString()
        )
      ) {
        continue;
      }

      // ==========================================
      // VALIDATE STATUS
      // ==========================================

      if (
        !validStatuses.includes(
          status
        )
      ) {
        continue;
      }

      // ==========================================
      // CREATE OR UPDATE
      // ==========================================

      await Attendance.findOneAndUpdate(
        {
          session:
            session._id,

          student:
            studentId,
        },
        {
          session:
            session._id,

          course:
            session.course,

          student:
            studentId,

          status,

          markedBy:
            req.user._id,

          markedAt:
            new Date(),

          notes:
            notes || "",
        },
        {
          new: true,

          upsert: true,

          runValidators: true,
        }
      );
    }

    // ==============================================
    // RETURN UPDATED ROSTER
    // ==============================================

    const updatedAttendance =
      await Attendance.find({
        session:
          session._id,
      })
        .populate(
          "student",
          "name email studentId"
        )
        .populate(
          "markedBy",
          "name email role"
        );

    res.json({
      message:
        "Attendance saved successfully.",

      attendance:
        updatedAttendance,
    });

  } catch (error) {

    console.error(
      "Save attendance error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// FINALIZE ATTENDANCE
// PATCH /api/attendance/sessions/:sessionId/finalize
// Admin + Instructor
// ======================================================
//
// Once finalized, instructors can no longer edit it.
// Admin can still be given override functionality later.
// ======================================================

const finalizeAttendance = async (
  req,
  res
) => {
  try {

    const {
      sessionId,
    } = req.params;

    const session =
      await ClassSession.findById(
        sessionId
      );

    if (!session) {
      return res.status(404).json({
        message:
          "Class session not found.",
      });
    }

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "instructor" &&
      session.instructor.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot finalize another instructor's attendance.",
      });
    }

    // ==============================================
    // SESSION MUST BE OPEN
    // ==============================================

    if (
      session.status !==
      "Open"
    ) {
      return res.status(400).json({
        message:
          "Only open attendance sessions can be finalized.",
      });
    }

    // ==============================================
    // CHECK ENROLLMENT
    // ==============================================

    const enrollments =
      await Enrollment.find({
        course:
          session.course,

        status: {
          $in: [
            "Enrolled",
            "In Progress",
            "Completed",
          ],
        },
      }).select(
        "student"
      );

    // ==============================================
    // GET CURRENT ATTENDANCE
    // ==============================================

    const attendanceRecords =
      await Attendance.find({
        session:
          session._id,
      }).select(
        "student status"
      );

    const attendanceMap =
      new Map();

    attendanceRecords.forEach(
      (record) => {

        attendanceMap.set(
          record.student.toString(),
          record.status
        );

      }
    );

    // ==============================================
    // IMPORTANT:
    // EVERY ENROLLED STUDENT MUST HAVE A STATUS
    // BEFORE FINALIZATION.
    // ==============================================

    const missingAttendance =
      enrollments.filter(
        (enrollment) =>
          !attendanceMap.has(
            enrollment.student.toString()
          )
      );

    if (
      missingAttendance.length >
      0
    ) {
      return res.status(400).json({
        message:
          "Every enrolled student must have an attendance status before the session can be finalized.",

        missingCount:
          missingAttendance.length,
      });
    }

    // ==============================================
    // FINALIZE
    // ==============================================

    session.status =
      "Finalized";

    await session.save();

    res.json({
      message:
        "Attendance finalized successfully.",

      session,
    });

  } catch (error) {

    console.error(
      "Finalize attendance error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// GET STUDENT ATTENDANCE
// GET /api/attendance/student/:studentId
// Admin + Student
// ======================================================

const getStudentAttendance = async (
  req,
  res
) => {
  try {

    const {
      studentId,
    } = req.params;

    // ==============================================
    // STUDENTS CAN ONLY SEE THEIR OWN ATTENDANCE
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "student" &&
      req.user._id.toString() !==
        studentId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only view your own attendance.",
      });
    }

    // ==============================================
    // GET ATTENDANCE
    // ==============================================

    const attendance =
      await Attendance.find({
        student:
          studentId,
      })
        .populate(
          "course",
          "title code category"
        )
        .populate(
          "session",
          "date startTime endTime status"
        )
        .populate(
          "markedBy",
          "name role"
        )
        .sort({
          createdAt: -1,
        });

    // ==============================================
    // CALCULATE SUMMARY
    // ==============================================

    const total =
      attendance.length;

    const present =
      attendance.filter(
        (record) =>
          record.status ===
          "Present"
      ).length;

    const late =
      attendance.filter(
        (record) =>
          record.status ===
          "Late"
      ).length;

    const absent =
      attendance.filter(
        (record) =>
          record.status ===
          "Absent"
      ).length;

    const excused =
      attendance.filter(
        (record) =>
          record.status ===
          "Excused"
      ).length;

    const attended =
      present + late;

    const attendancePercentage =
      total > 0
        ? Math.round(
            (attended /
              total) *
              100
          )
        : 0;

    res.json({
      summary: {
        total,
        present,
        late,
        absent,
        excused,
        attendancePercentage,
      },

      attendance,
    });

  } catch (error) {

    console.error(
      "Get student attendance error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// GET COURSE ATTENDANCE
// GET /api/attendance/course/:courseId
// Admin + Instructor
// ======================================================
//
// Used later for instructor/admin reports.
// ======================================================

const getCourseAttendance = async (
  req,
  res
) => {
  try {

    const {
      courseId,
    } = req.params;

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

    // ==============================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ==============================================

    if (
      req.user.role.toLowerCase() ===
        "instructor" &&
      course.instructorUser.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You cannot view attendance for another instructor's course.",
      });
    }

    // ==============================================
    // GET ATTENDANCE
    // ==============================================

    const attendance =
      await Attendance.find({
        course:
          courseId,
      })
        .populate(
          "student",
          "name email studentId"
        )
        .populate(
          "session",
          "date startTime endTime status"
        )
        .populate(
          "markedBy",
          "name email role"
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

      totalRecords:
        attendance.length,

      attendance,
    });

  } catch (error) {

    console.error(
      "Get course attendance error:",
      error
    );

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createClassSession,

  getCourseSessions,

  getClassSession,

  openAttendance,

  getAttendanceRoster,

  saveAttendance,

  finalizeAttendance,

  getStudentAttendance,

  getCourseAttendance,
};