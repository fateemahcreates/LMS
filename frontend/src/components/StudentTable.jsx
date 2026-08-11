import { useState } from "react";
import "../styles/StudentTable.css";

import {
  FaSearch,
  FaUserGraduate,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaIdCard,
  FaEye,
} from "react-icons/fa";

function StudentTable({
  students = [],
  handleView,
  handleEdit,
  handleDelete,
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

      student.program
        ?.toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="gmt-student-table">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="gmt-student-table-header">

        <div>

          <h2>Student Directory</h2>

          <p>
            Manage all enrolled GMT Academy students.
          </p>

        </div>

        <div className="gmt-student-total">

          <FaUserGraduate />

          <span>
            {students.length} Student
            {students.length !== 1 && "s"}
          </span>

        </div>

      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="gmt-student-search">

        <FaSearch className="gmt-student-search-icon" />

        <input
          type="text"
          placeholder="Search by name, email, ID or programme..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

            {/* =====================================
          DESKTOP TABLE
      ===================================== */}

      <div className="gmt-student-table-wrapper">

        <table>

          <thead>

            <tr>

              <th>Student</th>

              <th>Email</th>

              <th>Student ID</th>

              <th>Programme</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.length === 0 ? (

              <tr>

                <td colSpan="5">

                  <div className="gmt-student-empty-state">

                    <FaUserGraduate
                      className="gmt-student-empty-icon"
                    />

                    <h3>No Students Found</h3>

                    <p>
                      There are currently no students
                      matching your search.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredStudents.map((student) => (

                <tr key={student._id}>

                  {/* Student */}

                  <td>

                    <div className="gmt-student-info">

                      <div className="gmt-student-avatar">

                        <FaUserGraduate />

                      </div>

                      <div>

                        <strong>
                          {student.user?.name}
                        </strong>

                      </div>

                    </div>

                  </td>

                  {/* Email */}

                  <td>

                    <div className="gmt-student-email">

                      <FaEnvelope />

                      <span>
                        {student.user?.email}
                      </span>

                    </div>

                  </td>

                  {/* Student ID */}

                  <td>

                    <div className="gmt-student-id">

                      <FaIdCard />

                      <span>
                        {student.studentId}
                      </span>

                    </div>

                  </td>

                  {/* Programme */}

                  <td>

                    <span className="gmt-student-program-badge">

                      {student.program}

                    </span>

                  </td>

                  {/* Actions */}

                  {/* Actions */}

<td>

  <div className="gmt-student-actions">

    <button
      className="gmt-student-view-btn"
      onClick={() => handleView(student)}
    >
      <FaEye />
      View
    </button>

    <button
      className="gmt-student-edit-btn"
      onClick={() => handleEdit(student)}
    >
      <FaEdit />
      Edit
    </button>

    <button
      className="gmt-student-delete-btn"
      onClick={() => handleDelete(student._id)}
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

            {/* =====================================
          MOBILE CARDS
      ===================================== */}

      <div className="gmt-mobile-students">

        {filteredStudents.length === 0 ? (

          <div className="gmt-student-empty-state">

            <FaUserGraduate
              className="gmt-student-empty-icon"
            />

            <h3>No Students Found</h3>

            <p>
              There are currently no students
              matching your search.
            </p>

          </div>

        ) : (

          filteredStudents.map((student) => (

            <div
              className="gmt-student-card"
              key={student._id}
            >

              {/* Card Header */}

              <div className="gmt-student-card-header">

                <div className="gmt-student-avatar">

                  <FaUserGraduate />

                </div>

                <div>

                  <h3>
                    {student.user?.name}
                  </h3>

                  <span>
                    {student.studentId}
                  </span>

                </div>

              </div>

              {/* Details */}

              <p>

                <strong>Email:</strong>{" "}

                {student.user?.email}

              </p>

              <p>

                <strong>Programme:</strong>{" "}

                {student.program}

              </p>

              {/* Actions */}

             {/* Actions */}

<div className="gmt-student-actions">

  <button
    className="gmt-student-view-btn"
    onClick={() => handleView(student)}
  >
    <FaEye />
    View
  </button>

  <button
    className="gmt-student-edit-btn"
    onClick={() => handleEdit(student)}
  >
    <FaEdit />
    Edit
  </button>

  <button
    className="gmt-student-delete-btn"
    onClick={() => handleDelete(student._id)}
  >
    <FaTrash />
    Delete
  </button>

</div>

</div>

          ))

        )}

      </div>

    </div>
  );
}

export default StudentTable;