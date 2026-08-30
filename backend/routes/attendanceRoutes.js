const express = require("express");

const {
  createClassSession,
  getCourseSessions,
  getClassSession,
  openAttendance,
  getAttendanceRoster,
  saveAttendance,
  finalizeAttendance,
  getStudentAttendance,
  getCourseAttendance,
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();


// ======================================================
// CLASS SESSION ROUTES
// ======================================================

// ------------------------------------------------------
// CREATE CLASS SESSION
// POST /api/attendance/sessions
// Admin + Instructor
// ------------------------------------------------------

router.post(
  "/sessions",
  protect,
  authorize("admin", "instructor"),
  createClassSession
);


// ------------------------------------------------------
// GET ALL SESSIONS FOR A COURSE
// GET /api/attendance/sessions/course/:courseId
// Admin + Instructor
// ------------------------------------------------------

router.get(
  "/sessions/course/:courseId",
  protect,
  authorize("admin", "instructor"),
  getCourseSessions
);


// ------------------------------------------------------
// GET SINGLE CLASS SESSION
// GET /api/attendance/sessions/:sessionId
// Admin + Instructor
// ------------------------------------------------------

router.get(
  "/sessions/:sessionId",
  protect,
  authorize("admin", "instructor"),
  getClassSession
);


// ------------------------------------------------------
// OPEN ATTENDANCE
// PATCH /api/attendance/sessions/:sessionId/open
// Admin + Instructor
// ------------------------------------------------------

router.patch(
  "/sessions/:sessionId/open",
  protect,
  authorize("admin", "instructor"),
  openAttendance
);


// ======================================================
// ATTENDANCE ROUTES
// ======================================================

// ------------------------------------------------------
// GET ATTENDANCE ROSTER
// GET /api/attendance/sessions/:sessionId/roster
// Admin + Instructor
// ------------------------------------------------------

router.get(
  "/sessions/:sessionId/roster",
  protect,
  authorize("admin", "instructor"),
  getAttendanceRoster
);


// ------------------------------------------------------
// SAVE / UPDATE ATTENDANCE
// PUT /api/attendance/sessions/:sessionId
// Admin + Instructor
// ------------------------------------------------------

router.put(
  "/sessions/:sessionId",
  protect,
  authorize("admin", "instructor"),
  saveAttendance
);


// ------------------------------------------------------
// FINALIZE ATTENDANCE
// PATCH /api/attendance/sessions/:sessionId/finalize
// Admin + Instructor
// ------------------------------------------------------

router.patch(
  "/sessions/:sessionId/finalize",
  protect,
  authorize("admin", "instructor"),
  finalizeAttendance
);


// ======================================================
// STUDENT ATTENDANCE
// ======================================================

// ------------------------------------------------------
// GET STUDENT ATTENDANCE
// GET /api/attendance/student/:studentId
// Admin + Student
// ------------------------------------------------------

router.get(
  "/student/:studentId",
  protect,
  authorize("admin", "student"),
  getStudentAttendance
);


// ======================================================
// COURSE ATTENDANCE
// ======================================================

// ------------------------------------------------------
// GET COURSE ATTENDANCE
// GET /api/attendance/course/:courseId
// Admin + Instructor
// ------------------------------------------------------

router.get(
  "/course/:courseId",
  protect,
  authorize("admin", "instructor"),
  getCourseAttendance
);


module.exports = router;