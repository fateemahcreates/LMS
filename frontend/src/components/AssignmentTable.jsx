import "../styles/AssignmentTable.css";

import {
  FaEdit,
  FaTrash,
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

function AssignmentTable({
  assignments,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="assignment-table-container">

      <div className="table-header">
        <h2>All Assignments</h2>

        <span>
          {assignments.length} Assignment
          {assignments.length !== 1 && "s"}
        </span>
      </div>

      {assignments.length === 0 ? (
        <div className="empty-state">

          <FaBookOpen className="empty-icon" />

          <h3>No Assignments Yet</h3>

          <p>
            Create your first assignment and it
            will appear here.
          </p>

        </div>
      ) : (
        <div className="table-responsive">

          <table className="assignment-table">

            <thead>

              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Due Date</th>
                <th>Marks</th>
                <th>Submission</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {assignments.map((assignment) => (
                <tr key={assignment._id}>

                  <td>

                    <div className="assignment-title">

                      <strong>
                        {assignment.title}
                      </strong>

                      <small>
                        {assignment.description?.length >
                        60
                          ? assignment.description.substring(
                              0,
                              60
                            ) + "..."
                          : assignment.description}
                      </small>

                    </div>

                  </td>

                  <td>
                    {assignment.course?.title ||
                      "N/A"}
                  </td>

                  <td>

                    <div className="table-date">

                      <FaCalendarAlt />

                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString()}

                    </div>

                  </td>

                  <td>
                    {assignment.totalMarks}
                  </td>

                  <td>

                    <span
                      className={`submission-badge ${assignment.submissionType.toLowerCase()}`}
                    >
                      {assignment.submissionType}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`status-badge ${assignment.status.toLowerCase()}`}
                    >
                      <FaCheckCircle />

                      {assignment.status}

                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(assignment)
                        }
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            assignment._id
                          )
                        }
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AssignmentTable;