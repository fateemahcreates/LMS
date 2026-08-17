import { useEffect, useState } from "react";

import {
  FaCalendarPlus,
  FaCalendarAlt,
  FaClock,
  FaBookOpen,
  FaStickyNote,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

import {
  getInstructorCourses,
} from "../../services/courseService";

import {
  createClassSession,
} from "../../services/classSessionService";

import "../../styles/InstructorClassSessions.css";


function InstructorClassSessions() {

  // ======================================================
  // STATE
  // ======================================================

  const [courses, setCourses] = useState([]);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    course: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });


  // ======================================================
  // LOAD INSTRUCTOR COURSES
  // ======================================================

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


  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");

  };


  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // ====================================================
    // VALIDATION
    // ====================================================

    if (!form.course) {

      setError(
        "Please select a course."
      );

      return;
    }


    if (!form.date) {

      setError(
        "Please select a class date."
      );

      return;
    }


    if (!form.startTime) {

      setError(
        "Please select a start time."
      );

      return;
    }


    if (!form.endTime) {

      setError(
        "Please select an end time."
      );

      return;
    }


    if (
      form.startTime >=
      form.endTime
    ) {

      setError(
        "End time must be later than start time."
      );

      return;
    }


    try {

      setCreating(true);


      // ==================================================
      // CREATE SESSION
      // ==================================================

      const response =
        await createClassSession({
          course:
            form.course,

          date:
            form.date,

          startTime:
            form.startTime,

          endTime:
            form.endTime,

          notes:
            form.notes,
        });


      console.log(
        "Created class session:",
        response
      );


      setSuccess(
        response?.message ||
        "Class session created successfully."
      );


      // ==================================================
      // RESET FORM
      // Keep course selected for convenience.
      // ==================================================

      setForm((current) => ({
        course:
          current.course,

        date: "",

        startTime: "",

        endTime: "",

        notes: "",
      }));

    } catch (err) {

      console.error(
        "Create class session error:",
        err
      );

      setError(
        err.message ||
        "Unable to create class session."
      );

    } finally {

      setCreating(false);

    }

  };


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <main className="instructor-class-sessions-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="instructor-class-sessions-header">

        <div>

          <span className="instructor-class-sessions-eyebrow">
            INSTRUCTOR PORTAL
          </span>

          <h1>
            Class Sessions
          </h1>

          <p>
            Create and schedule class sessions for
            your courses before taking attendance.
          </p>

        </div>


        <div className="instructor-class-sessions-header-icon">

          <FaCalendarPlus />

        </div>

      </section>


      {/* ==================================================
          SUCCESS
      ================================================== */}

      {success && (

        <div className="instructor-session-alert success">

          <FaCheckCircle />

          <span>
            {success}
          </span>

        </div>

      )}


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (

        <div className="instructor-session-alert error">

          <FaExclamationCircle />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* ==================================================
          FORM CARD
      ================================================== */}

      <section className="instructor-class-session-card">

        <div className="instructor-class-session-card-header">

          <div className="instructor-class-session-card-icon">

            <FaCalendarPlus />

          </div>


          <div>

            <h2>
              Create Class Session
            </h2>

            <p>
              Schedule a class that will later be
              available for attendance.
            </p>

          </div>

        </div>


        <form
          className="instructor-class-session-form"
          onSubmit={handleSubmit}
        >

          {/* ==================================================
              COURSE
          ================================================== */}

          <div className="instructor-session-form-group">

            <label htmlFor="course">

              <FaBookOpen />

              Course

            </label>


            <select
              id="course"
              name="course"
              value={form.course}
              onChange={handleChange}
              disabled={
                loadingCourses ||
                creating
              }
            >

              <option value="">

                {loadingCourses
                  ? "Loading your courses..."
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


          {/* ==================================================
              DATE
          ================================================== */}

          <div className="instructor-session-form-group">

            <label htmlFor="date">

              <FaCalendarAlt />

              Class Date

            </label>


            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              disabled={creating}
            />

          </div>


          {/* ==================================================
              TIME ROW
          ================================================== */}

          <div className="instructor-session-time-row">

            <div className="instructor-session-form-group">

              <label htmlFor="startTime">

                <FaClock />

                Start Time

              </label>


              <input
                id="startTime"
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                disabled={creating}
              />

            </div>


            <div className="instructor-session-form-group">

              <label htmlFor="endTime">

                <FaClock />

                End Time

              </label>


              <input
                id="endTime"
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                disabled={creating}
              />

            </div>

          </div>


          {/* ==================================================
              NOTES
          ================================================== */}

          <div className="instructor-session-form-group">

            <label htmlFor="notes">

              <FaStickyNote />

              Notes
              <span>
                Optional
              </span>

            </label>


            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              disabled={creating}
              placeholder="Add any notes about this class session..."
              rows="4"
            />

          </div>


          {/* ==================================================
              INFO
          ================================================== */}

          <div className="instructor-session-info">

            <FaCalendarAlt />

            <div>

              <strong>
                Attendance workflow
              </strong>

              <p>
                This session will be created as
                <strong> Scheduled </strong>.
                You can open it from the Attendance
                page when the class begins.
              </p>

            </div>

          </div>


          {/* ==================================================
              SUBMIT
          ================================================== */}

          <div className="instructor-session-form-actions">

            <button
              type="submit"
              className="instructor-session-create-btn"
              disabled={
                creating ||
                loadingCourses ||
                courses.length === 0
              }
            >

              {creating ? (

                <>
                  <FaSpinner className="session-spinner" />

                  Creating Session...
                </>

              ) : (

                <>
                  <FaCalendarPlus />

                  Create Class Session
                </>

              )}

            </button>

          </div>

        </form>

      </section>

    </main>

  );

}


export default InstructorClassSessions;