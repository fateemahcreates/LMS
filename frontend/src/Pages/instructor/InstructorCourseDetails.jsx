import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  FaUsers,
  FaBookOpen,
  FaClipboardList,
  FaBullhorn,
  FaChartLine,
  FaClock,
  FaLayerGroup,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";

import { getCourseDetails } from "../../services/instructorService";

import "../../styles/InstructorCourseDetails.css";

function InstructorCourseDetails() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const res = await getCourseDetails(courseId);

      console.log("COURSE DETAILS");
      console.log(res.data);

      setCourse(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="course-details-page">
        <div className="loading-state">
          Loading course...
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="course-details-page">
        <div className="empty-state">
          Course not found.
        </div>
      </main>
    );
  }

  return (
    <main className="course-details-page">

      <Link
        to="/instructor/courses"
        className="back-button"
      >
        <FaArrowLeft />
        Back to My Courses
      </Link>

      {/* ==============================
          HEADER
      ============================== */}

      <section className="course-banner">

        <div>

          <h1>{course.title}</h1>

          <p>{course.description}</p>

          <div className="course-tags">

            <span>{course.category}</span>

            <span>{course.level}</span>

            <span>{course.status}</span>

          </div>

        </div>

      </section>

      {/* ==============================
          STATS
      ============================== */}

      <section className="overview-grid">

        <div className="overview-card">
          <FaUsers />
          <h2>{course.students?.length || 0}</h2>
          <span>Students</span>
        </div>

        <div className="overview-card">
          <FaBookOpen />
          <h2>{course.totalLessons || 0}</h2>
          <span>Lessons</span>
        </div>

        <div className="overview-card">
          <FaClipboardList />
          <h2>{course.totalAssignments || 0}</h2>
          <span>Assignments</span>
        </div>

        <div className="overview-card">
          <FaChartLine />
          <h2>{course.completionRate || 0}%</h2>
          <span>Completion</span>
        </div>

      </section>

      {/* ==============================
          CONTENT
      ============================== */}

      <div className="details-layout">

        {/* LEFT */}

        <div className="details-main">

          <div className="details-card">

            <h3>Quick Actions</h3>

            <div className="quick-actions">

              <button>
                <FaPlus />
                Add Lesson
              </button>

              <button>
                <FaPlus />
                Create Assignment
              </button>

              <button>
                <FaBullhorn />
                Announcement
              </button>

            </div>

          </div>

          <div className="details-card">

            <h3>Recent Activity</h3>

            <div className="activity-item">
              No recent activity yet.
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <aside className="details-sidebar">

          <div className="details-card">

            <h3>Course Information</h3>

            <div className="info-row">

              <span>Course Code</span>

              <strong>{course.code}</strong>

            </div>

            <div className="info-row">

              <span>Instructor</span>

              <strong>{course.instructor}</strong>

            </div>

            <div className="info-row">

              <span>Duration</span>

              <strong>{course.duration || "-"}</strong>

            </div>

            <div className="info-row">

              <span>Category</span>

              <strong>{course.category}</strong>

            </div>

            <div className="info-row">

              <span>Difficulty</span>

              <strong>{course.level}</strong>

            </div>

            <div className="info-row">

              <span>Status</span>

              <strong>{course.status}</strong>

            </div>

            <div className="info-row">

              <span>Created</span>

              <strong>
                {new Date(course.createdAt).toLocaleDateString()}
              </strong>

            </div>

          </div>

          <div className="details-card">

            <h3>Course Summary</h3>

            <div className="summary-item">
              <FaClock />
              <span>{course.duration || "Not Set"}</span>
            </div>

            <div className="summary-item">
              <FaLayerGroup />
              <span>{course.category}</span>
            </div>

            <div className="summary-item">
              <FaUsers />
              <span>
                {course.students?.length || 0} Students
              </span>
            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default InstructorCourseDetails;