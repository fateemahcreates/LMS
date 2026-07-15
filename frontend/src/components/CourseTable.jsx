import { useState } from "react";
import "../styles/CourseTable.css";

import {
  FaSearch,
  FaBookOpen,
  FaEdit,
  FaTrash,
  FaUsers,
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

  return (
    <div className="course-table">

      {/* Header */}

      <div className="table-header">

        <div>
          <h2>Course Directory</h2>

          <p>
            Manage all academy courses.
          </p>
        </div>

        <div className="course-total">
          <FaBookOpen />

          <span>
            {courses.length} Course
            {courses.length !== 1 && "s"}
          </span>
        </div>

      </div>

      {/* Search */}

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

      {/* Desktop Table */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Title</th>
              <th>Code</th>
              <th>Category</th>
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

                  <div className="empty-state">

                    <FaBookOpen className="empty-icon" />

                    <h3>No Courses Found</h3>

                    <p>
                      Create your first course to get started.
                    </p>

                  </div>

                </td>
              </tr>

            ) : (

              filteredCourses.map((course) => (

                <tr key={course._id}>

                  <td>{course.title}</td>

                  <td>{course.code}</td>

                  <td>{course.category}</td>

                  <td>{course.level}</td>

                  <td>{course.duration}</td>

                  <td>
                    <FaUsers />

                    {" "}

                    {course.students?.length || 0}
                  </td>

                  <td>

                    <span
                      className={`status ${getStatusClass(
                        course.status
                      )}`}
                    >
                      {course.status}
                    </span>

                  </td>

                  <td className="action-buttons">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(course)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(course._id)
                      }
                    >
                      <FaTrash />
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Mobile Cards */}

      <div className="mobile-courses">

        {filteredCourses.map((course) => (

          <div
            className="course-card"
            key={course._id}
          >

            <h3>{course.title}</h3>

            <p>
              <strong>Code:</strong> {course.code}
            </p>

            <p>
              <strong>Category:</strong> {course.category}
            </p>

            <p>
              <strong>Level:</strong> {course.level}
            </p>

            <p>
              <strong>Duration:</strong> {course.duration}
            </p>

            <p>
              <strong>Status:</strong> {course.status}
            </p>

            <p>
              <strong>Students:</strong>{" "}
              {course.students?.length || 0}
            </p>

            <div className="action-buttons">

              <button
                className="edit-btn"
                onClick={() =>
                  handleEdit(course)
                }
              >
                <FaEdit />
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(course._id)
                }
              >
                <FaTrash />
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default CourseTable;