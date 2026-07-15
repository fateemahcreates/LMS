import { useEffect, useState } from "react";
import {
  getPublishedCourses,
} from "../../services/courseService";
import {
  enrollCourse,
} from "../../services/enrollmentService";

import "../../styles/BrowseCourses.css";

import {
  FaBookOpen,
  FaClock,
  FaUserTie,
  FaSearch,
} from "react-icons/fa";

function BrowseCourses() {
  // ==========================================
  // State
  // ==========================================
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ==========================================
  // Categories
  // ==========================================
  const categories = [
    "All",
    "Frontend",
    "Backend",
    "Full Stack",
    "Mobile",
    "UI/UX",
    "Data Science",
    "AI",
    "DevOps",
    "Cybersecurity",
    "Cloud",
  ];

  // ==========================================
  // Fetch Courses
  // ==========================================
  const fetchCourses = async () => {
    try {
      const res = await getPublishedCourses();

      setCourses(res.data);

    } catch (error) {
      console.error("Unable to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ==========================================
  // Handle Enrollment
  // ==========================================
  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);

      const res = await enrollCourse(courseId);

      alert(res.data.message);

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to enroll in this course."
      );
    } finally {
      setEnrollingId(null);
    }
  };

  // ==========================================
  // Filter Courses
  // ==========================================
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      course.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      course.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="browse-courses">
      {/* =======================================
          Header
      ======================================== */}

      <div className="page-header">
        <h1>Browse Courses</h1>

        <p>
          Discover professional courses and
          enroll in your learning journey.
        </p>
      </div>

      {/* =======================================
          Search
      ======================================== */}

      <div className="browse-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      {/* =======================================
          Categories
      ======================================== */}

      <div className="category-filter">
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item
                ? "active"
                : ""
            }
            onClick={() =>
              setCategory(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      {/* =======================================
          Loading
      ======================================== */}

      {loading ? (
        <div className="loading">
          <h3>Loading Courses...</h3>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">
          <FaBookOpen className="empty-icon" />

          <h3>No Courses Found</h3>

          <p>
            There are no published courses
            matching your search.
          </p>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <div
              className="course-card"
              key={course._id}
            >
              <img
                src={
                  course.thumbnail ||
                  "https://placehold.co/600x350?text=Tech+Academy"
                }
                alt={course.title}
              />

              <div className="course-content">
                {/* Category */}

                <span className="category">
                  {course.category}
                </span>

                {/* Title */}

                <h2>{course.title}</h2>

                {/* Description */}

                <p>{course.description}</p>

                {/* Level Badge */}

                <span
                  className={`level-badge ${course.level?.toLowerCase()}`}
                >
                  {course.level}
                </span>

                {/* Course Info */}

                <div className="course-meta">
                  <span>
                    <FaUserTie />
                    {course.instructor}
                  </span>

                  <span>
                    <FaClock />
                    {course.duration}
                  </span>

                  <span>
                    📚{" "}
                    {course.totalLessons || 0}
                    {" "}Lessons
                  </span>

                  <span>
                    👥{" "}
                    {course.totalStudents || 0}
                    {" "}Students
                  </span>
                </div>

                {/* Footer */}

                <div className="course-footer">
                  <span className="price">
                    {course.price === 0
                      ? "FREE"
                      : `$${course.price}`}
                  </span>

                  <button
                    className="register-btn"
                    disabled={
                      enrollingId ===
                      course._id
                    }
                    onClick={() =>
                      handleEnroll(course._id)
                    }
                  >
                    {enrollingId ===
                    course._id
                      ? "Enrolling..."
                      : "Enroll Now"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default BrowseCourses;