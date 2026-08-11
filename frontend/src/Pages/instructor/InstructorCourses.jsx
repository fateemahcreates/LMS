import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaUsers,
  FaClipboardList,
  FaArrowRight,
} from "react-icons/fa";

import { getInstructorCourses } from "../../services/instructorService";

import "../../styles/InstructorCourses.css";

function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getInstructorCourses();

      console.log("========== MY COURSES ==========");
      console.log(res.data);

      setCourses(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="instructor-courses-page">

      <div className="page-header">
        <div>
          <h1>My Courses</h1>

          <p>
            Courses assigned to you by the administrator.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h2>No Courses Assigned</h2>

          <p>
            Your assigned courses will appear here.
          </p>
        </div>
      ) : (
        <div className="instructor-course-grid">

          {courses.map((course) => (

            <div
              className="instructor-course-card"
              key={course._id}
            >
              <img
                src={
                  course.thumbnail ||
                  "https://placehold.co/600x350?text=GMT+Academy"
                }
                alt={course.title}
              />

              <div className="course-content">

                <span className={`status ${course.status.toLowerCase()}`}>
                  {course.status}
                </span>

                <h2>{course.title}</h2>

                <p className="course-code">
                  {course.code}
                </p>

                <div className="course-meta">

                  <span>
                    {course.category}
                  </span>

                  <span>
                    {course.level}
                  </span>

                </div>

                <div className="course-stats">

                  <div>
                    <FaUsers />

                    <span>
                      {course.students?.length || 0}
                    </span>
                  </div>

                  <div>
                    <FaClipboardList />

                    <span>
                      {course.totalAssignments || 0}
                    </span>
                  </div>

                </div>

                <Link
                  to={`/instructor/course/${course._id}`}
                  className="open-course-btn"
                >
                  Open Course

                  <FaArrowRight />
                </Link>

              </div>

            </div>

          ))}

        </div>
      )}

    </main>
  );
}

export default InstructorCourses;