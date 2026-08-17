import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaSyncAlt,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

import {
  getCourses,
} from "../services/courseService";

import {
  createClassSession,
  getCourseSessions,
} from "../services/instructorAttendanceService";

import "../styles/AdminClassSessions.css";


function AdminClassSessions() {

  // ======================================================
  // STATE
  // ======================================================

  const [courses, setCourses] = useState([]);

  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [sessions, setSessions] =
    useState([]);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingSessions, setLoadingSessions] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  // ======================================================
  // FORM
  // ======================================================

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });


  // ======================================================
  // LOAD COURSES
  // ======================================================

  useEffect(() => {

    loadCourses();

  }, []);


  const loadCourses = async () => {

    try {

      setLoadingCourses(true);

      setError("");

      const response =
        await getCourses();

      const data =
        response?.data || response;

      setCourses(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Load courses error:",
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


  // ======================================================
  // LOAD SESSIONS
  // ======================================================

  const loadSessions = async (
    courseId
  ) => {

    if (!courseId) {

      setSessions([]);

      return;

    }

    try {

      setLoadingSessions(true);

      setError("");

      const response =
        await getCourseSessions(
          courseId
        );

      const data =
        response?.sessions ||
        response?.data?.sessions ||
        response?.data ||
        response;

      setSessions(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Load sessions error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load class sessions."
      );

      setSessions([]);

    } finally {

      setLoadingSessions(false);

    }

  };


  // ======================================================
  // COURSE CHANGE
  // ======================================================

  const handleCourseChange = async (e) => {

    const courseId =
      e.target.value;

    setSelectedCourse(courseId);

    setSuccess("");

    setError("");

    await loadSessions(courseId);

  };


  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

  };


  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {

    setFormData({
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
    });

  };


  // ======================================================
  // CREATE SESSION
  // ======================================================

  const handleCreateSession = async (e) => {

    e.preventDefault();

    if (!selectedCourse) {

      setError(
        "Please select a course first."
      );

      return;

    }


    if (!formData.date) {

      setError(
        "Please select a session date."
      );

      return;

    }


    if (!formData.startTime) {

      setError(
        "Please enter a start time."
      );

      return;

    }


    if (!formData.endTime) {

      setError(
        "Please enter an end time."
      );

      return;

    }


    if (
      formData.endTime <=
      formData.startTime
    ) {

      setError(
        "End time must be later than start time."
      );

      return;

    }


    try {

      setCreating(true);

      setError("");

      setSuccess("");


      const payload = {

        course: selectedCourse,

        date: formData.date,

        startTime:
          formData.startTime,

        endTime:
          formData.endTime,

        notes:
          formData.notes.trim(),

      };


      const response =
        await createClassSession(
          payload
        );


      setSuccess(
        response?.message ||
        response?.data?.message ||
        "Class session created successfully."
      );


      resetForm();

      setShowForm(false);

      await loadSessions(
        selectedCourse
      );

    } catch (err) {

      console.error(
        "Create class session error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to create class session."
      );

    } finally {

      setCreating(false);

    }

  };


  // ======================================================
  // FORMAT DATE
  // ======================================================

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


  // ======================================================
  // STATUS CLASS
  // ======================================================

  const getStatusClass = (
    status
  ) => {

    switch (status) {

      case "Open":
        return "admin-class-session-status-open";

      case "Finalized":
        return "admin-class-session-status-finalized";

      case "Cancelled":
        return "admin-class-session-status-cancelled";

      default:
        return "admin-class-session-status-scheduled";

    }

  };


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div className="admin-class-sessions-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-class-sessions-header">

        <div>

          <h1>
            Class Sessions
          </h1>

          <p>
            Create and manage class sessions for
            your courses.
          </p>

        </div>


        <div className="admin-class-sessions-header-actions">

          <button
            type="button"
            className="admin-class-session-btn admin-class-session-btn-secondary"
            onClick={() => {

              if (selectedCourse) {
                loadSessions(
                  selectedCourse
                );
              } else {
                loadCourses();
              }

            }}
          >

            <FaSyncAlt />

            Refresh

          </button>


          {selectedCourse && (

            <button
              type="button"
              className="admin-class-session-btn admin-class-session-btn-primary"
              onClick={() => {

                setError("");

                setSuccess("");

                setShowForm(true);

              }}
            >

              <FaPlus />

              Create Session

            </button>

          )}

        </div>

      </div>


      {/* ==================================================
          ALERTS
      ================================================== */}

      {error && (

        <div className="admin-class-sessions-alert error">

          <span>
            {error}
          </span>

        </div>

      )}


      {success && (

        <div className="admin-class-sessions-alert success">

          <span>
            {success}
          </span>

        </div>

      )}


      {/* ==================================================
          COURSE SELECTION
      ================================================== */}

      <div className="admin-class-sessions-card">

        <div className="admin-class-sessions-card-header">

          <div>

            <h2>
              Select Course
            </h2>

            <p>
              Choose a course to view and manage
              its class sessions.
            </p>

          </div>

        </div>


        <select
          className="admin-class-sessions-select"
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
          CREATE FORM
      ================================================== */}

      {showForm && (

        <div className="admin-class-sessions-card">

          <div className="admin-class-sessions-card-header">

            <div>

              <h2>
                Create Class Session
              </h2>

              <p>
                Schedule a new class session for
                the selected course.
              </p>

            </div>


            <button
              type="button"
              className="admin-class-session-close"
              onClick={() => {

                setShowForm(false);

                resetForm();

              }}
            >

              <FaTimes />

            </button>

          </div>


          <form
            className="admin-class-session-form"
            onSubmit={handleCreateSession}
          >

            <div className="admin-class-session-form-grid">

              <div className="admin-class-session-field">

                <label>
                  Date
                </label>

                <div className="admin-class-session-input-wrapper">

                  <FaCalendarAlt />

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="admin-class-session-field">

                <label>
                  Start Time
                </label>

                <div className="admin-class-session-input-wrapper">

                  <FaClock />

                  <input
                    type="time"
                    name="startTime"
                    value={
                      formData.startTime
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>


              <div className="admin-class-session-field">

                <label>
                  End Time
                </label>

                <div className="admin-class-session-input-wrapper">

                  <FaClock />

                  <input
                    type="time"
                    name="endTime"
                    value={
                      formData.endTime
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>


            <div className="admin-class-session-field">

              <label>
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Optional session notes..."
                rows="4"
              />

            </div>


            <div className="admin-class-session-form-actions">

              <button
                type="button"
                className="admin-class-session-btn admin-class-session-btn-secondary"
                onClick={() => {

                  setShowForm(false);

                  resetForm();

                }}
              >

                Cancel

              </button>


              <button
                type="submit"
                className="admin-class-session-btn admin-class-session-btn-primary"
                disabled={creating}
              >

                <FaPlus />

                {creating
                  ? "Creating..."
                  : "Create Session"}

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ==================================================
          SESSION LIST
      ================================================== */}

      {selectedCourse && (

        <div className="admin-class-sessions-card">

          <div className="admin-class-sessions-card-header">

            <div>

              <h2>
                Class Sessions
              </h2>

              <p>
                Sessions scheduled for the selected
                course.
              </p>

            </div>

          </div>


          {loadingSessions ? (

            <div className="admin-class-sessions-loading">

              <div className="admin-class-sessions-spinner" />

              Loading sessions...

            </div>

          ) : sessions.length === 0 ? (

            <div className="admin-class-sessions-empty">

              <FaCalendarAlt />

              <h3>
                No class sessions
              </h3>

              <p>
                No sessions have been created for
                this course yet.
              </p>

            </div>

          ) : (

            <div className="admin-class-sessions-table-wrapper">

              <table className="admin-class-sessions-table">

                <thead>

                  <tr>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Notes
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {sessions.map(
                    (session) => (

                      <tr
                        key={
                          session._id
                        }
                      >

                        <td>
                          {formatDate(
                            session.date
                          )}
                        </td>


                        <td>

                          <div className="admin-class-session-time">

                            <FaClock />

                            <span>
                              {session.startTime}
                              {" - "}
                              {session.endTime}
                            </span>

                          </div>

                        </td>


                        <td>

                          <span
                            className={`admin-class-session-status ${getStatusClass(
                              session.status
                            )}`}
                          >

                            {session.status}

                          </span>

                        </td>


                        <td>

                          {session.notes ||
                            "—"}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

    </div>

  );

}


export default AdminClassSessions;