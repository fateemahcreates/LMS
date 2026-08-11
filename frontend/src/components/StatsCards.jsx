import {
  FaUserGraduate,
  FaBookOpen,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaArchive,
} from "react-icons/fa";

import "../styles/StatsCards.css";

function StatsCards({
  students = [],
  courses = [],
  role,
}) {
  // ============================================================
  // SAFETY CHECKS
  // ============================================================

  const safeStudents = Array.isArray(students)
    ? students
    : [];

  const safeCourses = Array.isArray(courses)
    ? courses
    : [];

  const isAdmin =
    role?.toLowerCase() === "admin";

  // ============================================================
  // ADMIN STATS
  // ============================================================

  const totalStudents =
    safeStudents.length;

  const totalCourses =
    safeCourses.length;

  const instructors =
    safeCourses.filter(
      (course) => course.instructor
    ).length;

  const activeCourses =
    safeCourses.filter(
      (course) =>
        course.status === "Published"
    ).length;

  // ============================================================
  // INSTRUCTOR STATS
  // ============================================================

  const publishedCourses =
    safeCourses.filter(
      (course) =>
        course.status === "Published"
    ).length;

  const draftCourses =
    safeCourses.filter(
      (course) =>
        course.status === "Draft"
    ).length;

  const archivedCourses =
    safeCourses.filter(
      (course) =>
        course.status === "Archived"
    ).length;

  // ============================================================
  // CARD DATA
  // ============================================================

  const cards = isAdmin
    ? [
        {
          title: "Students",
          value: totalStudents,
          icon: <FaUserGraduate />,
          color: "red",
          trend: "+12%",
          trendType: "positive",
          subtitle: "Registered Students",
        },

        {
          title: "Courses",
          value: totalCourses,
          icon: <FaBookOpen />,
          color: "navy",
          trend: "+5%",
          trendType: "positive",
          subtitle: "Total Courses",
        },

        {
          title: "Instructors",
          value: instructors,
          icon: <FaChalkboardTeacher />,
          color: "gold",
          trend: "+2%",
          trendType: "positive",
          subtitle: "Active Lecturers",
        },

        {
          title: "Published",
          value: activeCourses,
          icon: <FaClipboardCheck />,
          color: "green",
          trend: "LIVE",
          trendType: "live",
          subtitle: "Running Courses",
        },
      ]
    : [
        {
          title: "My Courses",
          value: totalCourses,
          icon: <FaBookOpen />,
          color: "navy",
          trend: "",
          subtitle: "Courses Assigned",
        },

        {
          title: "Published",
          value: publishedCourses,
          icon: <FaClipboardCheck />,
          color: "green",
          trend: "",
          subtitle: "Live Courses",
        },

        {
          title: "Drafts",
          value: draftCourses,
          icon: <FaBookOpen />,
          color: "gold",
          trend: "",
          subtitle: "Pending Publication",
        },

        {
          title: "Archived",
          value: archivedCourses,
          icon: <FaArchive />,
          color: "red",
          trend: "",
          subtitle: "Archived Courses",
        },
      ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section className="gmt-stats-grid">

      {cards.map((card) => (
        <article
          key={card.title}
          className={`gmt-stat-card gmt-stat-card-${card.color}`}
        >

          {/* ==================================================
              TOP
          ================================================== */}

          <div className="gmt-stat-card-top">

            <div className="gmt-stat-icon">
              {card.icon}
            </div>

            {card.trend && (
              <span
                className={`gmt-stat-trend ${card.trendType || ""}`}
              >
                {card.trend}
              </span>
            )}

          </div>

          {/* ==================================================
              VALUE
          ================================================== */}

          <div className="gmt-stat-value">
            {card.value}
          </div>

          {/* ==================================================
              TITLE
          ================================================== */}

          <h3 className="gmt-stat-title">
            {card.title}
          </h3>

          {/* ==================================================
              SUBTITLE
          ================================================== */}

          <p className="gmt-stat-subtitle">
            {card.subtitle}
          </p>

        </article>
      ))}

    </section>
  );
}

export default StatsCards;