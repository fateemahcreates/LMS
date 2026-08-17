import { useEffect, useState } from "react";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationCircle,
  FaCalendarAlt,
  FaBookOpen,
  FaRedo,
} from "react-icons/fa";

import { getStudentAttendance } from "../../services/attendanceService";

import "../../styles/StudentAttendance.css";


function StudentAttendance() {

  // ======================================================
  // STATE
  // ======================================================

  const [attendance, setAttendance] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
    attendancePercentage: 0,
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ======================================================
  // GET LOGGED-IN USER
  // ======================================================

  const getLoggedInUser = () => {

    try {

      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);

    } catch (error) {

      console.error(
        "Unable to read logged-in user:",
        error
      );

      return null;
    }
  };


  // ======================================================
  // LOAD ATTENDANCE
  // ======================================================

  const loadAttendance = async () => {

    try {

      setLoading(true);
      setError("");

      const user = getLoggedInUser();


      console.log(
        "========== STUDENT ATTENDANCE =========="
      );

      console.log(
        "Logged-in user:",
        user
      );


      if (!user) {

        throw new Error(
          "No logged-in user found."
        );

      }


      // ==================================================
      // GET STUDENT ID
      // ==================================================

      const studentId =
        user._id || user.id;


      console.log(
        "Attendance student ID:",
        studentId
      );


      if (!studentId) {

        throw new Error(
          "Unable to identify the logged-in student."
        );

      }


      // ==================================================
      // GET ATTENDANCE THROUGH SERVICE
      // ==================================================

      const response =
        await getStudentAttendance(
          studentId
        );


      console.log(
        "Attendance response:",
        response
      );


      // ==================================================
      // STORE SUMMARY
      // ==================================================

      setSummary(
        response.summary || {
          total: 0,
          present: 0,
          late: 0,
          absent: 0,
          excused: 0,
          attendancePercentage: 0,
        }
      );


      // ==================================================
      // STORE ATTENDANCE
      // ==================================================

      setAttendance(
        response.attendance || []
      );


    } catch (error) {

      console.error(
        "Load student attendance error:",
        error
      );


      console.error(
        "Attendance error response:",
        error.response?.data
      );


      setError(
        error.message ||
        error.response?.data?.message ||
        "Unable to load attendance."
      );


    } finally {

      setLoading(false);

    }

  };


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    loadAttendance();

  }, []);


  // ======================================================
  // LOADING STATE
  // ======================================================

  if (loading) {

    return (

      <main className="student-attendance-page">

        <div className="student-attendance-loading">

          <div className="attendance-spinner"></div>

          <p>
            Loading attendance...
          </p>

        </div>

      </main>

    );

  }


  // ======================================================
  // ERROR STATE
  // ======================================================

  if (error) {

    return (

      <main className="student-attendance-page">

        <div className="student-attendance-error">

          <div className="attendance-error-icon">

            <FaExclamationCircle />

          </div>


          <h2>
            Unable to load attendance
          </h2>


          <p>
            {error}
          </p>


          <button
            type="button"
            className="attendance-retry-btn"
            onClick={loadAttendance}
          >

            <FaRedo />

            Try Again

          </button>

        </div>

      </main>

    );

  }


  // ======================================================
  // PAGE
  // ======================================================

  return (

    <main className="student-attendance-page">


      {/* ==================================================
          HEADER
      ================================================== */}

      <section className="student-attendance-header">

        <div>

          <span className="attendance-eyebrow">
            STUDENT PORTAL
          </span>


          <h1>
            My Attendance
          </h1>


          <p>
            Track your attendance across all
            enrolled courses.
          </p>

        </div>


        <button
          type="button"
          className="attendance-refresh-btn"
          onClick={loadAttendance}
        >

          <FaRedo />

          Refresh

        </button>

      </section>


      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <section className="attendance-summary-grid">


        {/* TOTAL */}

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon total">

            <FaCalendarAlt />

          </div>


          <div>

            <span>
              Total Classes
            </span>


            <strong>
              {summary.total}
            </strong>

          </div>

        </div>


        {/* PRESENT */}

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon present">

            <FaCheckCircle />

          </div>


          <div>

            <span>
              Present
            </span>


            <strong>
              {summary.present}
            </strong>

          </div>

        </div>


        {/* LATE */}

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon late">

            <FaClock />

          </div>


          <div>

            <span>
              Late
            </span>


            <strong>
              {summary.late}
            </strong>

          </div>

        </div>


        {/* ABSENT */}

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon absent">

            <FaTimesCircle />

          </div>


          <div>

            <span>
              Absent
            </span>


            <strong>
              {summary.absent}
            </strong>

          </div>

        </div>


        {/* PERCENTAGE */}

        <div className="attendance-summary-card percentage">


          <div className="attendance-percentage-circle">

            <strong>
              {summary.attendancePercentage}%
            </strong>

          </div>


          <div>

            <span>
              Attendance Rate
            </span>


            <strong>
              {summary.attendancePercentage}%
            </strong>

          </div>

        </div>


      </section>


      {/* ==================================================
          ATTENDANCE HISTORY
      ================================================== */}

      <section className="student-attendance-card">


        <div className="student-attendance-card-header">

          <div>

            <h2>
              Attendance History
            </h2>


            <p>
              Your recorded attendance sessions
            </p>

          </div>


          <FaBookOpen />

        </div>


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {attendance.length === 0 ? (

          <div className="attendance-empty">

            <FaCalendarAlt />


            <h3>
              No attendance records yet
            </h3>


            <p>
              Your attendance will appear here
              once your instructor records a class.
            </p>

          </div>

        ) : (


          /* ==================================================
             TABLE
          ================================================== */

          <div className="attendance-table-wrapper">

            <table className="student-attendance-table">


              <thead>

                <tr>

                  <th>
                    Course
                  </th>

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
                    Marked By
                  </th>

                </tr>

              </thead>


              <tbody>

                {attendance.map(
                  (record) => {

                    const session =
                      record.session;

                    const course =
                      record.course;


                    return (

                      <tr
                        key={record._id}
                      >


                        {/* COURSE */}

                        <td>

                          <div className="attendance-course">

                            <strong>

                              {course?.title ||
                                "Unknown Course"}

                            </strong>


                            <span>

                              {course?.code ||
                                "—"}

                            </span>

                          </div>

                        </td>


                        {/* DATE */}

                        <td>

                          <div className="attendance-date">

                            <FaCalendarAlt />


                            {session?.date
                              ? new Date(
                                  session.date
                                ).toLocaleDateString(
                                  "en-US",
                                  {
                                    year:
                                      "numeric",

                                    month:
                                      "short",

                                    day:
                                      "numeric",
                                  }
                                )
                              : "—"}

                          </div>

                        </td>


                        {/* TIME */}

                        <td>

                          {session?.startTime ||
                            "—"}

                          {" - "}

                          {session?.endTime ||
                            "—"}

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`attendance-status ${
                              record.status
                                ?.toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )
                            }`}
                          >


                            {record.status ===
                              "Present" && (

                              <FaCheckCircle />

                            )}


                            {record.status ===
                              "Absent" && (

                              <FaTimesCircle />

                            )}


                            {record.status ===
                              "Late" && (

                              <FaClock />

                            )}


                            {record.status ===
                              "Excused" && (

                              <FaExclamationCircle />

                            )}


                            {record.status ||
                              "Unknown"}

                          </span>

                        </td>


                        {/* MARKED BY */}

                        <td>

                          {record.markedBy?.name ||
                            "—"}

                        </td>


                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>

  );

}


export default StudentAttendance;