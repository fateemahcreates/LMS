import { useState } from "react";
import "../styles/CourseTable.css";

import {
  FaSearch,
  FaBookOpen,
  FaUsers,
  FaUserTie,
  FaClock,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

function CourseTable({
  courses = [],
  handleDelete,
  handleEdit,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter((course) => {
    const search = searchTerm.toLowerCase();

    return (
      course.title?.toLowerCase().includes(search) ||
      course.code?.toLowerCase().includes(search) ||
      course.category?.toLowerCase().includes(search) ||
      course.level?.toLowerCase().includes(search) ||
      String(course.instructor || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Published":
        return "published";

      case "Draft":
        return "draft";

      case "Archived":
        return "archived";

      default:
        return "";
    }
  };

  const getLevelClass = (level) => {
    switch (level) {
      case "Beginner":
        return "beginner";

      case "Intermediate":
        return "intermediate";

      case "Advanced":
        return "advanced";

      default:
        return "";
    }
  };

  return (
    <div className="gmt-course-table">

      {/* Header */}

      <div className="gmt-course-table-header">

        <div>

          <h2>Course Directory</h2>

          <p>
            Manage all GMT Academy programmes.
          </p>

        </div>

        <div className="gmt-course-total">

          <FaBookOpen />

          <span>
            {courses.length} Course
            {courses.length !== 1 && "s"}
          </span>

        </div>

      </div>

      {/* Search */}

      <div className="gmt-course-search">

        <FaSearch className="gmt-course-search-icon" />

        <input
          type="text"
          placeholder="Search by title, code, category or instructor..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

      {/* Desktop */}

      <div className="gmt-course-table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Course</th>

              <th>Category</th>

              <th>Instructor</th>

              <th>Level</th>

              <th>Duration</th>

              <th>Students</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredCourses.length === 0 ? (

              <tr>

                <td colSpan="8">

                  <div className="gmt-course-empty-state">

                    <FaBookOpen className="gmt-course-empty-icon" />

                    <h3>No Courses Found</h3>

                    <p>
                      Create your first course to
                      get started.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredCourses.map((course) => (

                <tr key={course._id}>

                  {/* Course */}

                  <td>

                    <div className="gmt-course-info">

                      <div className="gmt-course-avatar">

                        <FaBookOpen />

                      </div>

                      <div>

                        <strong>
                          {course.title}
                        </strong>

                        <p>
                          {course.code}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Category */}

                  <td>

                    <span className="gmt-course-category-badge">

                      {course.category}

                    </span>

                  </td>

                  {/* Instructor */}

                  <td>

                    <div className="gmt-course-instructor">

                      <FaUserTie />

                      <span>

                        {course.instructor ||
                          "Not Assigned"}

                      </span>

                    </div>

                  </td>

                  {/* Level */}

                  <td>

                    <span
                      className={`gmt-course-level-badge ${getLevelClass(
                        course.level
                      )}`}
                    >

                      {course.level}

                    </span>

                  </td>

                  {/* Duration */}

                  <td>

                    <div className="gmt-course-duration">

                      <FaClock />

                      <span>

                        {course.duration}

                      </span>

                    </div>

                  </td>

                  {/* Students */}

                  <td>

                    <div className="gmt-course-students">

                      <FaUsers />

                      <span>

                        {course.students?.length || 0}

                      </span>

                    </div>

                  </td>

                  {/* Status */}

                  <td>

                    <span
                      className={`gmt-course-status ${getStatusClass(
                        course.status
                      )}`}
                    >

                      {course.status}

                    </span>

                  </td>

                  {/* Actions */}

                  <td>

                    <div className="gmt-course-actions">

                      <button
                        className="gmt-course-edit-btn"
                        onClick={() =>
                          handleEdit(course)
                        }
                      >

                        <FaEdit />

                        Edit

                      </button>

                      <button
                        className="gmt-course-delete-btn"
                        onClick={() =>
                          handleDelete(course._id)
                        }
                      >

                        <FaTrash />

                        Delete

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Mobile */}

      <div className="gmt-mobile-courses">

        {filteredCourses.map((course) => (

          <div
            className="gmt-course-card"
            key={course._id}
          >

            <div className="gmt-course-card-header">

              <div className="gmt-course-avatar">

                <FaBookOpen />

              </div>

              <div>

                <h3>{course.title}</h3>

                <span>{course.code}</span>

              </div>

            </div>

            <p>

              <strong>Category:</strong>{" "}

              {course.category}

            </p>

            <p>

              <strong>Instructor:</strong>{" "}

              {course.instructor ||
                "Not Assigned"}

            </p>

            <p>

              <strong>Level:</strong>{" "}

              {course.level}

            </p>

            <p>

              <strong>Duration:</strong>{" "}

              {course.duration}

            </p>

            <p>

              <strong>Students:</strong>{" "}

              {course.students?.length || 0}

            </p>

            <p>

              <strong>Status:</strong>{" "}

              <span
                className={`gmt-course-status ${getStatusClass(
                  course.status
                )}`}
              >

                {course.status}

              </span>

            </p>

            <div className="gmt-course-actions">

              <button
                className="gmt-course-edit-btn"
                onClick={() =>
                  handleEdit(course)
                }
              >

                <FaEdit />

                Edit

              </button>

              <button
                className="gmt-course-delete-btn"
                onClick={() =>
                  handleDelete(course._id)
                }
              >

                <FaTrash />

                Delete

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CourseTable;