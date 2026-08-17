import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaLock,
  FaClipboardCheck,
  FaExclamationCircle,
  FaSyncAlt,
} from "react-icons/fa";

import {
  getInstructorCourses,
} from "../../services/courseService";

import {
  getCourseSessions,
  getAttendanceRoster,
  openAttendance,
  saveAttendance,
  finalizeAttendance,
} from "../../services/instructorAttendanceService";

import "../../styles/InstructorAttendance.css";


// ======================================================
// INSTRUCTOR ATTENDANCE
// ======================================================

function InstructorAttendance() {

  // ====================================================
  // STATE
  // ====================================================

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [sessions, setSessions] =
    useState([]);

  const [selectedSession, setSelectedSession] =
    useState("");

  const [roster, setRoster] =
    useState([]);

  const [sessionInfo, setSessionInfo] =
    useState(null);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingSessions, setLoadingSessions] =
    useState(false);

  const [loadingRoster, setLoadingRoster] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [finalizing, setFinalizing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ====================================================
  // LOAD INSTRUCTOR COURSES
  // ====================================================

  useEffect(() => {

    loadCourses();

  }, []);


  const loadCourses = async () => {

    try {

      setLoadingCourses(true);
      setError("");

      const data =
        await getInstructorCourses();

      setCourses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Load instructor courses error:",
        err
      );

      setError(
        err.message ||
        "Unable to load your courses."
      );

    } finally {

      setLoadingCourses(false);

    }

  };


  // ====================================================
  // LOAD COURSE SESSIONS
  // ====================================================

  const handleCourseChange = async (e) => {

    const courseId =
      e.target.value;

    setSelectedCourse(courseId);

    setSelectedSession("");

    setSessions([]);

    setRoster([]);

    setSessionInfo(null);

    setSuccess("");

    setError("");


    if (!courseId) {
      return;
    }


    try {

      setLoadingSessions(true);

      const data =
        await getCourseSessions(
          courseId
        );

      setSessions(
        Array.isArray(data?.sessions)
          ? data.sessions
          : []
      );

    } catch (err) {

      console.error(
        "Load course sessions error:",
        err
      );

      setError(
        err.message ||
        "Unable to load class sessions."
      );

    } finally {

      setLoadingSessions(false);

    }

  };


  // ====================================================
  // LOAD ATTENDANCE ROSTER
  // ====================================================

  const handleSessionChange = async (e) => {

    const sessionId =
      e.target.value;

    setSelectedSession(sessionId);

    setRoster([]);

    setSessionInfo(null);

    setSuccess("");

    setError("");


    if (!sessionId) {
      return;
    }


    await loadRoster(sessionId);

  };


  // ====================================================
  // LOAD ROSTER FUNCTION
  // ====================================================

  const loadRoster = async (
    sessionId
  ) => {

    try {

      setLoadingRoster(true);

      setError("");

      const data =
        await getAttendanceRoster(
          sessionId
        );


      setSessionInfo(
        data?.session || null
      );


      const formattedRoster =
        (data?.roster || []).map(
          (student) => ({
            ...student,

            status:
              student.status ||
              "Not Marked",

            notes:
              student.notes ||
              "",
          })
        );


      setRoster(
        formattedRoster
      );

    } catch (err) {

      console.error(
        "Load attendance roster error:",
        err
      );

      setError(
        err.message ||
        "Unable to load attendance roster."
      );

    } finally {

      setLoadingRoster(false);

    }

  };


  // ====================================================
  // OPEN ATTENDANCE
  // ====================================================

  const handleOpenAttendance = async () => {

    if (!selectedSession) {
      return;
    }


    try {

      setError("");

      setSuccess("");

      const data =
        await openAttendance(
          selectedSession
        );


      setSessionInfo(
        data?.session ||
        null
      );


      setSuccess(
        "Attendance is now open."
      );


      await loadRoster(
        selectedSession
      );

    } catch (err) {

      console.error(
        "Open attendance error:",
        err
      );

      setError(
        err.message ||
        "Unable to open attendance."
      );

    }

  };


  // ====================================================
  // CHANGE ATTENDANCE STATUS
  // ====================================================

  const handleStatusChange = (
    studentId,
    status
  ) => {

    setRoster((currentRoster) =>

      currentRoster.map(
        (student) => {

          if (
            student.student?._id ===
            studentId
          ) {

            return {
              ...student,
              status,
            };

          }

          return student;

        }
      )

    );

  };


  // ====================================================
  // CHANGE NOTES
  // ====================================================

  const handleNotesChange = (
    studentId,
    notes
  ) => {

    setRoster((currentRoster) =>

      currentRoster.map(
        (student) => {

          if (
            student.student?._id ===
            studentId
          ) {

            return {
              ...student,
              notes,
            };

          }

          return student;

        }
      )

    );

  };


  // ====================================================
  // SAVE ATTENDANCE
  // ====================================================

  const handleSaveAttendance = async () => {

    if (!selectedSession) {
      return;
    }


    const incomplete =
      roster.filter(
        (student) =>
          ![
            "Present",
            "Absent",
            "Late",
            "Excused",
          ].includes(
            student.status
          )
      );


    if (incomplete.length > 0) {

      setError(
        `Please mark attendance for all ${incomplete.length} remaining student(s).`
      );

      return;

    }


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const attendance =
        roster.map(
          (student) => ({
            studentId:
              student.student._id,

            status:
              student.status,

            notes:
              student.notes || "",
          })
        );


      const data =
        await saveAttendance(
          selectedSession,
          attendance
        );


      setSuccess(
        data?.message ||
        "Attendance saved successfully."
      );


      await loadRoster(
        selectedSession
      );

    } catch (err) {

      console.error(
        "Save attendance error:",
        err
      );

      setError(
        err.message ||
        "Unable to save attendance."
      );

    } finally {

      setSaving(false);

    }

  };


  // ====================================================
  // FINALIZE ATTENDANCE
  // ====================================================

  const handleFinalizeAttendance =
    async () => {

      if (!selectedSession) {
        return;
      }


      const incomplete =
        roster.filter(
          (student) =>
            ![
              "Present",
              "Absent",
              "Late",
              "Excused",
            ].includes(
              student.status
            )
        );


      if (incomplete.length > 0) {

        setError(
          "Every enrolled student must have an attendance status before finalization."
        );

        return;

      }


      const confirmed =
        window.confirm(
          "Are you sure you want to finalize this attendance session? You will no longer be able to edit it."
        );


      if (!confirmed) {
        return;
      }


      try {

        setFinalizing(true);

        setError("");

        setSuccess("");


        const data =
          await finalizeAttendance(
            selectedSession
          );


        setSessionInfo(
          data?.session ||
          null
        );


        setSuccess(
          data?.message ||
          "Attendance finalized successfully."
        );


        await loadRoster(
          selectedSession
        );


        // Refresh session list
        if (selectedCourse) {

          const sessionsData =
            await getCourseSessions(
              selectedCourse
            );

          setSessions(
            Array.isArray(
              sessionsData?.sessions
            )
              ? sessionsData.sessions
              : []
          );

        }

      } catch (err) {

        console.error(
          "Finalize attendance error:",
          err
        );

        setError(
          err.message ||
          "Unable to finalize attendance."
        );

      } finally {

        setFinalizing(false);

      }

    };


  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  };


  // ====================================================
  // SUMMARY COUNTS
  // ====================================================

  const summary = useMemo(() => {

    return {

      total:
        roster.length,

      present:
        roster.filter(
          (student) =>
            student.status ===
            "Present"
        ).length,

      absent:
        roster.filter(
          (student) =>
            student.status ===
            "Absent"
        ).length,

      late:
        roster.filter(
          (student) =>
            student.status ===
            "Late"
        ).length,

      excused:
        roster.filter(
          (student) =>
            student.status ===
            "Excused"
        ).length,

      notMarked:
        roster.filter(
          (student) =>
            student.status ===
            "Not Marked"
        ).length,

    };

  }, [roster]);


  // ====================================================
  // STATUS CLASS
  // ====================================================

  const getStatusClass = (
    status
  ) => {

    switch (status) {

      case "Present":
        return "instructor-attendance-badge-present";

      case "Absent":
        return "instructor-attendance-badge-absent";

      case "Late":
        return "instructor-attendance-badge-late";

      case "Excused":
        return "instructor-attendance-badge-excused";

      default:
        return "instructor-attendance-badge-not-marked";

    }

  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="instructor-attendance-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="instructor-attendance-header">

        <div className="instructor-attendance-header-left">

          <h1 className="instructor-attendance-title">
            Attendance
          </h1>

          <p className="instructor-attendance-subtitle">
            Manage class attendance, mark student
            presence, and finalize attendance sessions.
          </p>

        </div>


        <div className="instructor-attendance-header-action">

          <button
            type="button"
            className="instructor-attendance-btn instructor-attendance-btn-secondary"
            onClick={() => {

              if (selectedSession) {
                loadRoster(selectedSession);
              }

            }}
            disabled={
              !selectedSession ||
              loadingRoster
            }
          >

            <FaSyncAlt />

            Refresh

          </button>

        </div>

      </div>



      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="instructor-attendance-error">

          <FaExclamationCircle />

          <span>
            {error}
          </span>

        </div>

      )}



      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (

        <div
          className="instructor-attendance-error"
          style={{
            background: "#ecfdf5",
            borderColor: "#a7f3d0",
            color: "#047857",
          }}
        >

          <FaCheckCircle />

          <span>
            {success}
          </span>

        </div>

      )}



      {/* =================================================
          COURSE SELECTION
      ================================================= */}

      <div className="instructor-attendance-course-card">

        <div className="instructor-attendance-course-card-header">

          <h2 className="instructor-attendance-course-card-title">
            Select Course
          </h2>

          <p className="instructor-attendance-course-card-description">
            Choose one of your assigned courses to view
            its attendance sessions.
          </p>

        </div>


        <select
          className="instructor-attendance-course-select"
          value={selectedCourse}
          onChange={handleCourseChange}
          disabled={loadingCourses}
        >

          <option value="">
            {loadingCourses
              ? "Loading courses..."
              : "Select a course"}
          </option>


          {courses.map(
            (course) => (

              <option
                key={course._id}
                value={course._id}
              >

                {course.title}

                {course.code
                  ? ` — ${course.code}`
                  : ""}

              </option>

            )
          )}

        </select>

      </div>



      {/* =================================================
          SESSION SELECTION
      ================================================= */}

      {selectedCourse && (

        <div className="instructor-attendance-course-card">

          <div className="instructor-attendance-course-card-header">

            <h2 className="instructor-attendance-course-card-title">
              Select Class Session
            </h2>

            <p className="instructor-attendance-course-card-description">
              Choose the class session whose attendance
              you want to manage.
            </p>

          </div>


          {loadingSessions ? (

            <div className="instructor-attendance-loading">

              <div className="instructor-attendance-spinner" />

              Loading class sessions...

            </div>

          ) : sessions.length === 0 ? (

            <div className="instructor-attendance-empty">

              <div className="instructor-attendance-empty-icon">

                <FaCalendarAlt />

              </div>

              <h3 className="instructor-attendance-empty-title">
                No class sessions
              </h3>

              <p className="instructor-attendance-empty-text">
                No attendance sessions have been created
                for this course yet.
              </p>

            </div>

          ) : (

            <select
              className="instructor-attendance-course-select"
              value={selectedSession}
              onChange={handleSessionChange}
            >

              <option value="">
                Select a class session
              </option>


              {sessions.map(
                (session) => (

                  <option
                    key={session._id}
                    value={session._id}
                  >

                    {formatDate(session.date)}

                    {" — "}

                    {session.startTime}

                    {" - "}

                    {session.endTime}

                    {" — "}

                    {session.status}

                  </option>

                )
              )}

            </select>

          )}

        </div>

      )}



      {/* =================================================
          SESSION DETAILS
      ================================================= */}

      {sessionInfo && (

        <>

          <div className="instructor-attendance-session-card">

            <div className="instructor-attendance-session-header">

              <div>

                <h2 className="instructor-attendance-session-title">

                  {sessionInfo.course?.title ||
                    "Class Session"}

                </h2>

                <p className="instructor-attendance-session-code">

                  {sessionInfo.course?.code ||
                    ""}

                </p>

              </div>


              <span
                className={`instructor-attendance-session-status ${
                  sessionInfo.status === "Open"
                    ? "instructor-attendance-status-open"
                    : sessionInfo.status === "Finalized"
                    ? "instructor-attendance-status-finalized"
                    : sessionInfo.status === "Cancelled"
                    ? "instructor-attendance-status-cancelled"
                    : "instructor-attendance-status-scheduled"
                }`}
              >

                {sessionInfo.status}

              </span>

            </div>


            <div className="instructor-attendance-session-meta">

              <div className="instructor-attendance-meta-item">

                <span className="instructor-attendance-meta-label">
                  Date
                </span>

                <span className="instructor-attendance-meta-value">

                  <FaCalendarAlt />

                  {" "}

                  {formatDate(
                    sessionInfo.date
                  )}

                </span>

              </div>


              <div className="instructor-attendance-meta-item">

                <span className="instructor-attendance-meta-label">
                  Start Time
                </span>

                <span className="instructor-attendance-meta-value">

                  <FaClock />

                  {" "}

                  {sessionInfo.startTime}

                </span>

              </div>


              <div className="instructor-attendance-meta-item">

                <span className="instructor-attendance-meta-label">
                  End Time
                </span>

                <span className="instructor-attendance-meta-value">

                  <FaClock />

                  {" "}

                  {sessionInfo.endTime}

                </span>

              </div>


              <div className="instructor-attendance-meta-item">

                <span className="instructor-attendance-meta-label">
                  Students
                </span>

                <span className="instructor-attendance-meta-value">

                  <FaUsers />

                  {" "}

                  {summary.total}

                </span>

              </div>

            </div>

          </div>



          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="instructor-attendance-summary">

            <div className="instructor-attendance-summary-card">

              <span className="instructor-attendance-summary-label">
                Total Students
              </span>

              <strong className="instructor-attendance-summary-value">
                {summary.total}
              </strong>

            </div>


            <div className="instructor-attendance-summary-card">

              <span className="instructor-attendance-summary-label">
                Present
              </span>

              <strong className="instructor-attendance-summary-value">
                {summary.present}
              </strong>

            </div>


            <div className="instructor-attendance-summary-card">

              <span className="instructor-attendance-summary-label">
                Absent
              </span>

              <strong className="instructor-attendance-summary-value">
                {summary.absent}
              </strong>

            </div>


            <div className="instructor-attendance-summary-card">

              <span className="instructor-attendance-summary-label">
                Not Marked
              </span>

              <strong className="instructor-attendance-summary-value">
                {summary.notMarked}
              </strong>

            </div>

          </div>



          {/* =================================================
              OPEN ATTENDANCE
          ================================================= */}

          {sessionInfo.status === "Scheduled" && (

            <div
              className="instructor-attendance-actions"
              style={{
                background: "#ffffff",
                border:
                  "1px solid #e7eaf0",
                borderRadius: "14px",
                marginBottom: "22px",
              }}
            >

              <div className="instructor-attendance-actions-left">

                <FaClipboardCheck />

                <span className="instructor-attendance-action-hint">

                  Open this session before marking
                  attendance.

                </span>

              </div>


              <button
                type="button"
                className="instructor-attendance-btn instructor-attendance-btn-primary"
                onClick={
                  handleOpenAttendance
                }
              >

                <FaClipboardCheck />

                Open Attendance

              </button>

            </div>

          )}



          {/* =================================================
              ROSTER
          ================================================= */}

          <div className="instructor-attendance-roster-card">

            <div className="instructor-attendance-roster-header">

              <div>

                <h2 className="instructor-attendance-roster-title">
                  Student Attendance
                </h2>

                <p className="instructor-attendance-roster-description">
                  Mark each enrolled student's attendance
                  status.
                </p>

              </div>


              <FaUsers />

            </div>


            {loadingRoster ? (

              <div className="instructor-attendance-loading">

                <div className="instructor-attendance-spinner" />

                Loading student roster...

              </div>

            ) : roster.length === 0 ? (

              <div className="instructor-attendance-empty">

                <div className="instructor-attendance-empty-icon">

                  <FaUsers />

                </div>

                <h3 className="instructor-attendance-empty-title">
                  No enrolled students
                </h3>

                <p className="instructor-attendance-empty-text">
                  There are currently no active students
                  enrolled in this course.
                </p>

              </div>

            ) : (

              <div className="instructor-attendance-table-wrapper">

                <table className="instructor-attendance-table">

                  <thead>

                    <tr>

                      <th>
                        Student
                      </th>

                      <th>
                        Student ID
                      </th>

                      <th>
                        Attendance
                      </th>

                      <th>
                        Notes
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {roster.map(
                      (student) => (

                        <tr
                          key={
                            student.student._id
                          }
                        >

                          <td>

                            <div className="instructor-attendance-student">

                              <div className="instructor-attendance-student-avatar">

                                {student.student.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "S"}

                              </div>


                              <div className="instructor-attendance-student-info">

                                <p className="instructor-attendance-student-name">

                                  {student.student.name ||
                                    "Student"}

                                </p>

                                <span className="instructor-attendance-student-email">

                                  {student.student.email ||
                                    "No email"}

                                </span>

                              </div>

                            </div>

                          </td>


                          <td>

                            <span className="instructor-attendance-student-id">

                              {student.student.studentId ||
                                "—"}

                            </span>

                          </td>


                          <td>

                            {sessionInfo.status ===
                            "Open" ? (

                              <select
                                className="instructor-attendance-status-select"
                                value={
                                  student.status
                                }
                                onChange={(e) =>
                                  handleStatusChange(
                                    student.student._id,
                                    e.target.value
                                  )
                                }
                              >

                                <option value="Not Marked">
                                  Not Marked
                                </option>

                                <option value="Present">
                                  Present
                                </option>

                                <option value="Absent">
                                  Absent
                                </option>

                                <option value="Late">
                                  Late
                                </option>

                                <option value="Excused">
                                  Excused
                                </option>

                              </select>

                            ) : (

                              <span
                                className={`instructor-attendance-badge ${getStatusClass(
                                  student.status
                                )}`}
                              >

                                {student.status}

                              </span>

                            )}

                          </td>


                          <td>

                            {sessionInfo.status ===
                            "Open" ? (

                              <input
                                type="text"
                                className="instructor-attendance-notes-input"
                                value={
                                  student.notes ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleNotesChange(
                                    student.student._id,
                                    e.target.value
                                  )
                                }
                                placeholder="Optional note"
                              />

                            ) : (

                              <span>
                                {student.notes ||
                                  "—"}
                              </span>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}



            {/* =================================================
                ACTIONS
            ================================================= */}

            {roster.length > 0 &&
              sessionInfo.status ===
                "Open" && (

                <div className="instructor-attendance-actions">

                  <div className="instructor-attendance-actions-left">

                    <span className="instructor-attendance-action-hint">

                      {summary.notMarked > 0
                        ? `${summary.notMarked} student(s) still need attendance.`
                        : "All students have been marked."}

                    </span>

                  </div>


                  <button
                    type="button"
                    className="instructor-attendance-btn instructor-attendance-btn-primary"
                    onClick={
                      handleSaveAttendance
                    }
                    disabled={
                      saving ||
                      summary.notMarked > 0
                    }
                  >

                    <FaCheckCircle />

                    {saving
                      ? "Saving..."
                      : "Save Attendance"}

                  </button>


                  <button
                    type="button"
                    className="instructor-attendance-btn instructor-attendance-btn-success"
                    onClick={
                      handleFinalizeAttendance
                    }
                    disabled={
                      finalizing ||
                      summary.notMarked > 0
                    }
                  >

                    <FaLock />

                    {finalizing
                      ? "Finalizing..."
                      : "Finalize Attendance"}

                  </button>

                </div>

              )}


            {/* =================================================
                FINALIZED MESSAGE
            ================================================= */}

            {sessionInfo.status ===
              "Finalized" && (

              <div className="instructor-attendance-actions">

                <div className="instructor-attendance-actions-left">

                  <FaLock />

                  <span className="instructor-attendance-action-hint">

                    This attendance session has been
                    finalized and can no longer be edited.

                  </span>

                </div>

              </div>

            )}

          </div>

        </>

      )}

    </div>

  );

}


export default InstructorAttendance;