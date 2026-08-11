import { FaBookOpen } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

import "../styles/RecentCourses.css";

function RecentCourses({ courses = [] }) {

  const safeCourses = Array.isArray(courses)
    ? courses
    : [];

  const recentCourses = safeCourses
    .slice()
    .reverse();

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "active";

      case "Draft":
        return "draft";

      case "Archived":
        return "archived";

      default:
        return "draft";
    }
  };

  return (
    <div className="course-recent-card">

      {/* Header */}

      <div className="course-recent-header">

        <div>

          <span className="course-section-tag">
            RECENT COURSES
          </span>

          <h2>Newest Published Courses</h2>

        </div>

        <div className="course-recent-total">
          {String(recentCourses.length).padStart(2, "0")}
        </div>

      </div>

      {recentCourses.length === 0 ? (

        <div className="course-empty-recent">

          <FaBookOpen className="course-empty-icon" />

          <h3>No Courses Found</h3>

          <p>
            Newly created courses will
            appear here.
          </p>

        </div>

      ) : (

        <div className="course-recent-list">

          {recentCourses.map((course) => (

            <div
              className="course-recent-item"
              key={course._id}
            >

              {/* Icon */}

              <div className="course-avatar">

                <FaBookOpen />

              </div>

              {/* Content */}

              <div className="course-content">

                <div className="course-top">

                  <h4>{course.courseName}</h4>

                  <span
                    className={`course-status ${getStatusClass(course.status)}`}
                  >
                    <span className="course-status-dot"></span>

                    {course.status}
                  </span>

                </div>

                <div className="course-code">

                  <small>COURSE CODE</small>

                  <h5>
                    {course.courseCode || "Not Assigned"}
                  </h5>

                </div>

                <div className="course-meta">

                  <span>
                    {course.category || "General"}
                  </span>

                  <span className="course-meta-divider">
                    •
                  </span>

                  <span>
                    {course.instructor || "No Instructor"}
                  </span>

                </div>

              </div>

              {/* Action */}

              <button className="course-action">

                <FiArrowUpRight />

              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentCourses;