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
  FaBookOpen,
} from "react-icons/fa";

import { getCourses } from "../services/courseService";

import {
  getCourseSessions,
  getAttendanceRoster,
  openAttendance,
  saveAttendance,
  finalizeAttendance,
} from "../services/instructorAttendanceService";

import "../styles/AdminAttendance.css";


// ======================================================
// ADMIN ATTENDANCE
// ======================================================

function AdminAttendance() {

  // ====================================================
  // COURSES
  // ====================================================

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [loadingCourses, setLoadingCourses] =
    useState(true);


  // ====================================================
  // SESSIONS
  // ====================================================

  const [sessions, setSessions] =
    useState([]);

  const [selectedSession, setSelectedSession] =
    useState("");

  const [loadingSessions, setLoadingSessions] =
    useState(false);


  // ====================================================
  // ROSTER
  // ====================================================

  const [roster, setRoster] =
    useState([]);

  const [sessionInfo, setSessionInfo] =
    useState(null);

  const [loadingRoster, setLoadingRoster] =
    useState(false);


  // ====================================================
  // ACTION STATES
  // ====================================================

  const [saving, setSaving] =
    useState(false);

  const [finalizing, setFinalizing] =
    useState(false);

  const [opening, setOpening] =
    useState(false);


  // ====================================================
  // MESSAGES
  // ====================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ====================================================
  // LOAD COURSES
  // ====================================================

  useEffect(() => {

    loadCourses();

  }, []);


  const loadCourses = async () => {

    try {

      setLoadingCourses(true);

      setError("");

      const response =
        await getCourses();

      /*
       * Axios service may return either:
       *
       * response.data
       *
       * or directly an array depending on
       * the service implementation.
       */

      const data =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.courses)
          ? response.courses
          : [];

      setCourses(data);

    } catch (err) {

      console.error(
        "Admin load courses error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load courses."
      );

    } finally {

      setLoadingCourses(false);

    }

  };


  // ====================================================
  // LOAD COURSE SESSIONS
  // ====================================================

  const handleCourseChange = async (event) => {

    const courseId =
      event.target.value;

    setSelectedCourse(courseId);

    setSelectedSession("");

    setSessions([]);

    setRoster([]);

    setSessionInfo(null);

    setError("");

    setSuccess("");


    if (!courseId) {
      return;
    }


    try {

      setLoadingSessions(true);

      const response =
        await getCourseSessions(courseId);


      const data =
        Array.isArray(response?.sessions)
          ? response.sessions
          : Array.isArray(response?.data?.sessions)
          ? response.data.sessions
          : Array.isArray(response)
          ? response
          : [];


      setSessions(data);

    } catch (err) {

      console.error(
        "Admin load sessions error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load class sessions."
      );

    } finally {

      setLoadingSessions(false);

    }

  };


  // ====================================================
  // LOAD ROSTER
  // ====================================================

  const handleSessionChange = async (event) => {

    const sessionId =
      event.target.value;

    setSelectedSession(sessionId);

    setRoster([]);

    setSessionInfo(null);

    setError("");

    setSuccess("");


    if (!sessionId) {
      return;
    }


    await loadRoster(sessionId);

  };


  const loadRoster = async (sessionId) => {

    try {

      setLoadingRoster(true);

      setError("");

      const response =
        await getAttendanceRoster(sessionId);


      const session =
        response?.session ||
        response?.data?.session ||
        null;


      const rawRoster =
        response?.roster ||
        response?.data?.roster ||
        [];


      const formattedRoster =
        rawRoster.map((student) => ({

          ...student,

          status:
            student.status ||
            "Not Marked",

          notes:
            student.notes ||
            "",

        }));


      setSessionInfo(session);

      setRoster(formattedRoster);

    } catch (err) {

      console.error(
        "Admin load roster error:",
        err
      );

      setError(
        err.response?.data?.message ||
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

      setOpening(true);

      setError("");

      setSuccess("");


      const response =
        await openAttendance(
          selectedSession
        );


      setSessionInfo(
        response?.session ||
        response?.data?.session ||
        null
      );


      setSuccess(
        response?.message ||
        response?.data?.message ||
        "Attendance is now open."
      );


      await loadRoster(
        selectedSession
      );


      await refreshSessions();

    } catch (err) {

      console.error(
        "Admin open attendance error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to open attendance."
      );

    } finally {

      setOpening(false);

    }

  };


  // ====================================================
  // STATUS CHANGE
  // ====================================================

  const handleStatusChange = (
    studentId,
    status
  ) => {

    setRoster((currentRoster) =>

      currentRoster.map((student) => {

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

      })

    );

  };


  // ====================================================
  // NOTES CHANGE
  // ====================================================

  const handleNotesChange = (
    studentId,
    notes
  ) => {

    setRoster((currentRoster) =>

      currentRoster.map((student) => {

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

      })

    );

  };


  // ====================================================
  // VALIDATE ATTENDANCE
  // ====================================================

  const getIncompleteCount = () => {

    return roster.filter(
      (student) =>
        ![
          "Present",
          "Absent",
          "Late",
          "Excused",
        ].includes(student.status)
    ).length;

  };


  // ====================================================
  // SAVE ATTENDANCE
  // ====================================================

  const handleSaveAttendance = async () => {

    if (!selectedSession) {
      return;
    }


    const incomplete =
      getIncompleteCount();


    if (incomplete > 0) {

      setError(
        `Please mark attendance for all ${incomplete} remaining student(s).`
      );

      return;

    }


    try {

      setSaving(true);

      setError("");

      setSuccess("");


      const attendance =
        roster.map((student) => ({

          studentId:
            student.student._id,

          status:
            student.status,

          notes:
            student.notes || "",

        }));


      const response =
        await saveAttendance(
          selectedSession,
          attendance
        );


      setSuccess(
        response?.message ||
        response?.data?.message ||
        "Attendance saved successfully."
      );


      await loadRoster(
        selectedSession
      );

    } catch (err) {

      console.error(
        "Admin save attendance error:",
        err
      );

      setError(
        err.response?.data?.message ||
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
        getIncompleteCount();


      if (incomplete > 0) {

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


        const response =
          await finalizeAttendance(
            selectedSession
          );


        setSessionInfo(
          response?.session ||
          response?.data?.session ||
          null
        );


        setSuccess(
          response?.message ||
          response?.data?.message ||
          "Attendance finalized successfully."
        );


        await loadRoster(
          selectedSession
        );


        await refreshSessions();

      } catch (err) {

        console.error(
          "Admin finalize attendance error:",
          err
        );

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to finalize attendance."
        );

      } finally {

        setFinalizing(false);

      }

    };


  // ====================================================
  // REFRESH SESSIONS
  // ====================================================

  const refreshSessions = async () => {

    if (!selectedCourse) {
      return;
    }


    try {

      const response =
        await getCourseSessions(
          selectedCourse
        );


      const data =
        Array.isArray(response?.sessions)
          ? response.sessions
          : Array.isArray(response?.data?.sessions)
          ? response.data.sessions
          : Array.isArray(response)
          ? response
          : [];


      setSessions(data);

    } catch (err) {

      console.error(
        "Refresh sessions error:",
        err
      );

    }

  };


  // ====================================================
  // REFRESH EVERYTHING
  // ====================================================

  const handleRefresh = async () => {

    setError("");

    setSuccess("");


    await loadCourses();


    if (selectedCourse) {

      await refreshSessions();

    }


    if (selectedSession) {

      await loadRoster(
        selectedSession
      );

    }

  };


  // ====================================================
  // DATE FORMAT
  // ====================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }


    return new Date(
      date
    ).toLocaleDateString(
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
  // SUMMARY
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

  const getStatusClass = (status) => {

    switch (status) {

      case "Present":
        return "admin-attendance-badge-present";

      case "Absent":
        return "admin-attendance-badge-absent";

      case "Late":
        return "admin-attendance-badge-late";

      case "Excused":
        return "admin-attendance-badge-excused";

      default:
        return "admin-attendance-badge-not-marked";

    }

  };


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="admin-attendance-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-attendance-header">

        <div className="admin-attendance-header-left">

          <div className="admin-attendance-header-icon">
            <FaClipboardCheck />
          </div>

          <div>

            <h1 className="admin-attendance-title">
              Attendance
            </h1>

            <p className="admin-attendance-subtitle">
              Monitor and manage attendance across
              all courses and class sessions.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="admin-attendance-refresh-btn"
          onClick={handleRefresh}
          disabled={
            loadingCourses ||
            loadingSessions ||
            loadingRoster
          }
        >

          <FaSyncAlt />

          Refresh

        </button>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="admin-attendance-alert admin-attendance-alert-error">

          <FaExclamationCircle />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ==================================================
          SUCCESS
      ================================================== */}

      {success && (

        <div className="admin-attendance-alert admin-attendance-alert-success">

          <FaCheckCircle />

          <span>
            {success}
          </span>

        </div>

      )}


      {/* ==================================================
          COURSE SELECTION
      ================================================== */}

      <div className="admin-attendance-selection-card">

        <div className="admin-attendance-selection-header">

          <div className="admin-attendance-selection-icon">
            <FaBookOpen />
          </div>

          <div>

            <h2>
              Select Course
            </h2>

            <p>
              Choose a course to view its class
              sessions and attendance records.
            </p>

          </div>

        </div>


        <select
          className="admin-attendance-select"
          value={selectedCourse}
          onChange={handleCourseChange}
          disabled={loadingCourses}
        >

          <option value="">

            {loadingCourses
              ? "Loading courses..."
              : "Select a course"}

          </option>


          {courses.map((course) => (

            <option
              key={course._id}
              value={course._id}
            >

              {course.title}

              {course.code
                ? ` — ${course.code}`
                : ""}

            </option>

          ))}

        </select>

      </div>


      {/* ==================================================
          SESSION SELECTION
      ================================================== */}

      {selectedCourse && (

        <div className="admin-attendance-selection-card">

          <div className="admin-attendance-selection-header">

            <div className="admin-attendance-selection-icon">
              <FaCalendarAlt />
            </div>

            <div>

              <h2>
                Select Class Session
              </h2>

              <p>
                Choose a session to view and manage
                student attendance.
              </p>

            </div>

          </div>


          {loadingSessions ? (

            <div className="admin-attendance-loading">

              <div className="admin-attendance-spinner" />

              Loading class sessions...

            </div>

          ) : sessions.length === 0 ? (

            <div className="admin-attendance-empty">

              <FaCalendarAlt />

              <h3>
                No class sessions
              </h3>

              <p>
                No class sessions have been created
                for this course yet.
              </p>

            </div>

          ) : (

            <select
              className="admin-attendance-select"
              value={selectedSession}
              onChange={handleSessionChange}
            >

              <option value="">
                Select a class session
              </option>


              {sessions.map((session) => (

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

              ))}

            </select>

          )}

        </div>

      )}


      {/* ==================================================
          SESSION INFORMATION
      ================================================== */}

      {sessionInfo && (

        <>

          <div className="admin-attendance-session-card">

            <div className="admin-attendance-session-top">

              <div>

                <h2>
                  {sessionInfo.course?.title ||
                    "Class Session"}
                </h2>

                <span>
                  {sessionInfo.course?.code || ""}
                </span>

              </div>


              <span
                className={`admin-attendance-session-status ${
                  sessionInfo.status === "Open"
                    ? "admin-attendance-status-open"
                    : sessionInfo.status === "Finalized"
                    ? "admin-attendance-status-finalized"
                    : sessionInfo.status === "Cancelled"
                    ? "admin-attendance-status-cancelled"
                    : "admin-attendance-status-scheduled"
                }`}
              >

                {sessionInfo.status}

              </span>

            </div>


            <div className="admin-attendance-session-meta">

              <div>

                <span>
                  Date
                </span>

                <strong>

                  <FaCalendarAlt />

                  {formatDate(
                    sessionInfo.date
                  )}

                </strong>

              </div>


              <div>

                <span>
                  Start Time
                </span>

                <strong>

                  <FaClock />

                  {sessionInfo.startTime ||
                    "—"}

                </strong>

              </div>


              <div>

                <span>
                  End Time
                </span>

                <strong>

                  <FaClock />

                  {sessionInfo.endTime ||
                    "—"}

                </strong>

              </div>


              <div>

                <span>
                  Students
                </span>

                <strong>

                  <FaUsers />

                  {summary.total}

                </strong>

              </div>

            </div>

          </div>


          {/* ==================================================
              OPEN ATTENDANCE
          ================================================== */}

          {sessionInfo.status ===
            "Scheduled" && (

            <div className="admin-attendance-action-card">

              <div>

                <FaClipboardCheck />

                <div>

                  <h3>
                    Attendance is not open
                  </h3>

                  <p>
                    Open this session before
                    attendance can be marked.
                  </p>

                </div>

              </div>


              <button
                type="button"
                className="admin-attendance-primary-btn"
                onClick={
                  handleOpenAttendance
                }
                disabled={opening}
              >

                <FaClipboardCheck />

                {opening
                  ? "Opening..."
                  : "Open Attendance"}

              </button>

            </div>

          )}


          {/* ==================================================
              SUMMARY
          ================================================== */}

          <div className="admin-attendance-summary">

            <div className="admin-attendance-summary-card">

              <span>
                Total Students
              </span>

              <strong>
                {summary.total}
              </strong>

            </div>


            <div className="admin-attendance-summary-card">

              <span>
                Present
              </span>

              <strong>
                {summary.present}
              </strong>

            </div>


            <div className="admin-attendance-summary-card">

              <span>
                Absent
              </span>

              <strong>
                {summary.absent}
              </strong>

            </div>


            <div className="admin-attendance-summary-card">

              <span>
                Late
              </span>

              <strong>
                {summary.late}
              </strong>

            </div>


            <div className="admin-attendance-summary-card">

              <span>
                Excused
              </span>

              <strong>
                {summary.excused}
              </strong>

            </div>


            <div className="admin-attendance-summary-card">

              <span>
                Not Marked
              </span>

              <strong>
                {summary.notMarked}
              </strong>

            </div>

          </div>


          {/* ==================================================
              ROSTER
          ================================================== */}

          <div className="admin-attendance-roster-card">

            <div className="admin-attendance-roster-header">

              <div>

                <h2>
                  Student Attendance
                </h2>

                <p>
                  Review and manage attendance
                  records for this session.
                </p>

              </div>

              <FaUsers />

            </div>


            {loadingRoster ? (

              <div className="admin-attendance-loading">

                <div className="admin-attendance-spinner" />

                Loading student roster...

              </div>

            ) : roster.length === 0 ? (

              <div className="admin-attendance-empty">

                <FaUsers />

                <h3>
                  No enrolled students
                </h3>

                <p>
                  There are currently no active
                  students enrolled in this course.
                </p>

              </div>

            ) : (

              <div className="admin-attendance-table-wrapper">

                <table className="admin-attendance-table">

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

                    {roster.map((student) => (

                      <tr
                        key={
                          student.student?._id
                        }
                      >

                        <td>

                          <div className="admin-attendance-student">

                            <div className="admin-attendance-avatar">

                              {student.student?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "S"}

                            </div>


                            <div>

                              <strong>
                                {student.student?.name ||
                                  "Student"}
                              </strong>

                              <span>
                                {student.student?.email ||
                                  "No email"}
                              </span>

                            </div>

                          </div>

                        </td>


                        <td>

                          <span className="admin-attendance-student-id">

                            {student.student?.studentId ||
                              "—"}

                          </span>

                        </td>


                        <td>

                          {sessionInfo.status ===
                          "Open" ? (

                            <select
                              className="admin-attendance-status-select"
                              value={
                                student.status
                              }
                              onChange={(event) =>
                                handleStatusChange(
                                  student.student._id,
                                  event.target.value
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
                              className={`admin-attendance-badge ${getStatusClass(
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
                              className="admin-attendance-notes-input"
                              value={
                                student.notes ||
                                ""
                              }
                              onChange={(event) =>
                                handleNotesChange(
                                  student.student._id,
                                  event.target.value
                                )
                              }
                              placeholder="Optional note"
                            />

                          ) : (

                            <span className="admin-attendance-notes-text">

                              {student.notes ||
                                "—"}

                            </span>

                          )}

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}


            {/* ==================================================
                ACTIONS
            ================================================== */}

            {roster.length > 0 &&
              sessionInfo.status ===
                "Open" && (

              <div className="admin-attendance-actions">

                <div>

                  <span>

                    {summary.notMarked > 0
                      ? `${summary.notMarked} student(s) still need attendance.`
                      : "All students have been marked."}

                  </span>

                </div>


                <div className="admin-attendance-action-buttons">

                  <button
                    type="button"
                    className="admin-attendance-primary-btn"
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
                    className="admin-attendance-finalize-btn"
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

              </div>

            )}


            {/* ==================================================
                FINALIZED
            ================================================== */}

            {sessionInfo.status ===
              "Finalized" && (

              <div className="admin-attendance-finalized">

                <FaLock />

                <div>

                  <strong>
                    Attendance finalized
                  </strong>

                  <span>
                    This attendance session can no
                    longer be edited.
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


export default AdminAttendance;