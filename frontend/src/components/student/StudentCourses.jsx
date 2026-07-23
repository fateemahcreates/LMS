import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/StudentCourses.css";

import {
  FaBookOpen,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";

import { getMyCourses } from "../../services/enrollmentService";

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getMyCourses();

      setCourses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="student-courses">
        <p>Loading courses...</p>
      </section>
    );
  }

  return (
    <section className="student-courses">

      <div className="courses-header">
        <div>
          <h2>My Courses</h2>
          <p>Your enrolled courses</p>
        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate("/student/courses")}
        >
          View All
          <FaArrowRight />
        </button>
      </div>

      <div className="courses-list">

        {courses.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          courses.map((enrollment) => (
            <div
              key={enrollment._id}
              className="course-card"
            >
              <div className="course-icon">
                <FaBookOpen />
              </div>

              <div className="course-content">

                <div className="course-top">
                  <h3>{enrollment.course?.title}</h3>

                  <span className="course-code">
                    {enrollment.course?.code}
                  </span>
                </div>

                <p>{enrollment.course?.instructor}</p>

                <div className="progress-row">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${enrollment.progress}%`,
                      }}
                    />
                  </div>

                  <span>{enrollment.progress}%</span>
                </div>

                <div className="course-footer">

                  <div className="course-time">
                    <FaClock />
                    {enrollment.status}
                  </div>

                  <button className="continue-btn">
                    Continue
                  </button>

                </div>

              </div>

            </div>
          ))
        )}

      </div>

    </section>
  );
}

export default StudentCourses;