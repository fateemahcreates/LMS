import "../styles/StatsCards.css";


import {
  FaUserGraduate,
  FaBookOpen,
  FaLayerGroup,
  FaAward,
} from "react-icons/fa";

function StatsCards({ students = [], courses = [] }) {
  const stats = [
    {
      title: "Total Students",
      value: students.length,
      subtitle: "Enrolled Students",
      trend: `${students.length}`,
      icon: <FaUserGraduate />,
      color: "blue",
    },
    {
      title: "Courses",
      value: courses.length,
      subtitle: "Available Courses",
      trend: `${courses.length}`,
      icon: <FaBookOpen />,
      color: "green",
    },
    {
      title: "Active Courses",
      value: courses.filter(
        (course) => course.status === "Active"
      ).length,
      subtitle: "Currently Running",
      trend: `${courses.filter(
        (course) => course.status === "Active"
      ).length}`,
      icon: <FaLayerGroup />,
      color: "orange",
    },
    {
      title: "Draft Courses",
      value: courses.filter(
        (course) => course.status === "Draft"
      ).length,
      subtitle: "Pending Publication",
      trend: `${courses.filter(
        (course) => course.status === "Draft"
      ).length}`,
      icon: <FaAward />,
      color: "purple",
    },
  ];

  return (
    <section className="stats-grid">
      {stats.map((stat, index) => (
        <div
          className={`stat-card ${stat.color}`}
          key={index}
        >
          <div className="card-top">
            <div className={`stat-icon ${stat.color}`}>
              {stat.icon}
            </div>

            <span className="trend">
              {stat.trend}
            </span>
          </div>

          <h2 className="stat-value">{stat.value}</h2>

          <h4 className="stat-title">{stat.title}</h4>

          <p className="stat-subtitle">
            {stat.subtitle}
          </p>
        </div>
      ))}
    </section>
  );
}

export default StatsCards;