import { FaBookOpen } from "react-icons/fa";

import "../styles/RecentCourses.css";

function RecentCourses({ courses = [] }) {
  // Show the latest 5 courses
  const recentCourses = courses.slice(-5).reverse();

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "active";

      case "Draft":
        return "draft";

      case "Archived":
        return "archived";

      default:
        return "";
    }
  };

  return (
    <div className="recent-card">
      {/* Header */}
      <div className="recent-header">
        <h2>Recent Courses</h2>

        <span>{recentCourses.length}</span>
      </div>

      {/* Empty State */}
      {recentCourses.length === 0 ? (
        <div className="empty-recent">
          <FaBookOpen className="empty-icon" />

          <p>No courses found.</p>
        </div>
      ) : (
        <div className="recent-list">
          {recentCourses.map((course) => (
            <div
              className="recent-item"
              key={course._id}
            >
              <div className="course-avatar">
                <FaBookOpen />
              </div>

              <div className="course-info">
                <h4>{course.courseName}</h4>

                <p>{course.instructor}</p>

                <small>{course.category}</small>
              </div>

              <span
                className={`course-status ${getStatusClass(
                  course.status
                )}`}
              >
                {course.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentCourses;