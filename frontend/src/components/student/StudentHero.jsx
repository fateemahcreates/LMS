import "../../styles/StudentHero.css";

import {
  FaBookOpen,
  FaGraduationCap,
  FaCalendarAlt,
  FaIdCard,
  FaArrowRight,
} from "react-icons/fa";

function StudentHero({ student, enrollment }) {
  // ============================================================
  // STUDENT DATA
  // ============================================================

  const user = student?.user || {};

  // ============================================================
  // GREETING
  // ============================================================

  const currentHour = new Date().getHours();

  let greeting = "Good Evening";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  }

  // ============================================================
  // DATE
  // ============================================================

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // ============================================================
  // STUDENT NAME
  // ============================================================

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "Student";

  // ============================================================
  // COURSE DATA
  // ============================================================

  const course = enrollment?.course || {};

  const courseTitle =
    course?.title || "No Active Programme";

  const courseCode =
    course?.code || "Programme Code";

  const courseCategory =
    course?.category || "Software Engineering";

  const enrollmentStatus =
    enrollment?.status || "Not Enrolled";

  // ============================================================
  // STATUS CLASS
  // ============================================================

  const statusClass =
    enrollmentStatus
      .toLowerCase()
      .replace(/\s+/g, "-");

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="student-hero">

      {/* ======================================================
          LEFT SECTION
      ====================================================== */}

      <div className="student-hero-left">

        {/* BRAND / LOGO */}

        <div className="student-hero-brand">

          <div className="student-hero-logo-wrapper">
            <span className="student-hero-logo-mark">
              GMT
            </span>
          </div>

          <div className="student-hero-brand-text">

            <span>
              GMT SOFTWARE ACADEMY
            </span>

            <small>
              Student Learning Portal
            </small>

          </div>

        </div>


        {/* CONTENT */}

        <div className="student-hero-content">

          

          <h1>
            {greeting},{" "}
            <span>
              {firstName}
            </span>
          </h1>


          <p>
            Welcome back to GMT Software Academy.
            Track your academic progress, manage
            your courses and assignments, and stay
            connected with the latest academy updates.
          </p>


          {/* META INFORMATION */}

          <div className="student-hero-meta">

            {/* DATE */}

            <div className="student-hero-meta-item">

              <div className="student-hero-meta-icon">
                <FaCalendarAlt />
              </div>

              <div>

                <small>
                  TODAY
                </small>

                <span>
                  {today}
                </span>

              </div>

            </div>


            {/* PROGRAMME */}

            <div className="student-hero-meta-item">

              <div className="student-hero-meta-icon">
                <FaGraduationCap />
              </div>

              <div>

                <small>
                  PROGRAMME
                </small>

                <span>
                  {courseCategory}
                </span>

              </div>

            </div>


            {/* STUDENT ID */}

            <div className="student-hero-meta-item">

              <div className="student-hero-meta-icon">
                <FaIdCard />
              </div>

              <div>

                <small>
                  STUDENT ID
                </small>

                <span>
                  {student?.studentId ||
                    "Not Assigned"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          RIGHT SECTION
      ====================================================== */}

      <div className="student-hero-right">

        <div className="student-hero-course-card">

          {/* TOP */}

          <div className="student-hero-course-top">

            <span className="student-hero-course-label">
              CURRENT PROGRAMME
            </span>


            <div className="student-hero-course-icon">
              <FaBookOpen />
            </div>

          </div>


          {/* COURSE */}

          <div className="student-hero-course-content">

            <h2>
              {courseTitle}
            </h2>

            <p>
              {courseCode}
            </p>

          </div>


          {/* STATUS */}

          <div className="student-hero-course-status-row">

            <span className="student-hero-course-status-label">
              Enrollment Status
            </span>

            <span
              className={`student-hero-course-status ${statusClass}`}
            >

              <span className="student-hero-status-dot"></span>

              {enrollmentStatus}

            </span>

          </div>


          {/* FOOTER */}

          <div className="student-hero-course-footer">



          </div>

        </div>

      </div>

    </section>
  );
}

export default StudentHero;