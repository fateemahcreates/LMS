import { useState } from "react";
import "../styles/StudentTable.css";

import {
  FaSearch,
  FaUserGraduate,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

function StudentTable({
  students,
  handleDelete,
  handleEdit,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();

    return (
      student.user?.name
        ?.toLowerCase()
        .includes(search) ||

      student.user?.email
        ?.toLowerCase()
        .includes(search) ||

      student.studentId
        ?.toLowerCase()
        .includes(search) ||

      student.department
        ?.toLowerCase()
        .includes(search) ||

      student.level
        ?.toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="student-table">

      {/* Header */}

      <div className="table-header">

        <div>
          <h2>Student Directory</h2>

          <p>
            Manage enrolled students.
          </p>
        </div>

        <div className="student-total">
          <FaUserGraduate />

          <span>
            {students.length} Student
            {students.length !== 1 && "s"}
          </span>
        </div>

      </div>

      {/* Search */}

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

      {/* Desktop */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Student ID</th>
              <th>Department</th>
              <th>Level</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredStudents.length === 0 ? (

              <tr>
                <td colSpan="6">

                  <div className="empty-state">

                    <FaUserGraduate
                      className="empty-icon"
                    />

                    <h3>No Students Found</h3>

                  </div>

                </td>
              </tr>

            ) : (

              filteredStudents.map((student) => (

                <tr key={student._id}>

                  <td>
                    {student.user?.name}
                  </td>

                  <td>
                    {student.user?.email}
                  </td>

                  <td>
                    {student.studentId}
                  </td>

                  <td>
                    {student.department}
                  </td>

                  <td>
                    {student.level}
                  </td>

                  <td className="action-buttons">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(student)
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(student._id)
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

      {/* Mobile */}

      <div className="mobile-students">

        {filteredStudents.map((student) => (

          <div
            className="student-card"
            key={student._id}
          >

            <h3>
              {student.user?.name}
            </h3>

            <p>
              <strong>Email:</strong>{" "}
              {student.user?.email}
            </p>

            <p>
              <strong>Student ID:</strong>{" "}
              {student.studentId}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {student.department}
            </p>

            <p>
              <strong>Level:</strong>{" "}
              {student.level}
            </p>

            <div className="action-buttons">

              <button
                className="edit-btn"
                onClick={() =>
                  handleEdit(student)
                }
              >
                <FaEdit />
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(student._id)
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

export default StudentTable;