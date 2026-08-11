import "../styles/StudentSubmissionTable.css";

import {
  FaEye,
  FaFileAlt,
  FaUserGraduate,
} from "react-icons/fa";

function StudentSubmissionTable({
  submissions,
  onGrade,
}) {
  return (
    <div className="submission-table-container">

      <div className="submission-header">

        <h2>Student Submissions</h2>

        <span className="submission-count">
          {submissions.length} Submission
          {submissions.length !== 1 && "s"}
        </span>

      </div>

      {submissions.length === 0 ? (

        <div className="no-submissions">

          <FaFileAlt className="empty-icon" />

          <h3>No Student Submissions Yet</h3>

          <p>
            Student uploads will appear here
            once assignments are submitted.
          </p>

        </div>

      ) : (

        <div className="table-responsive">

          <table className="submission-table">

            <thead>

              <tr>

                <th>Student</th>

                <th>Course</th>

                <th>Assignment</th>

                <th>Status</th>

                <th>Score</th>

                <th>Submitted</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {submissions.map((submission) => (

                <tr key={submission._id}>

                  <td>

                    <strong>
                      {submission.student?.name ||
                        "Unknown Student"}
                    </strong>

                    <br />

                    <small>
                      {submission.student?.email}
                    </small>

                  </td>

                  <td>
                    {submission.course?.title ||
                      "--"}
                  </td>

                  <td>
                    {submission.assignment?.title ||
                      "--"}
                  </td>

                  <td>

                    <span
                      className={`status-badge ${submission.status
                        ?.toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {submission.status}
                    </span>

                  </td>

                  <td>

                    {submission.score !==
                      null &&
                    submission.score !==
                      undefined
                      ? `${submission.score}/100`
                      : "--"}

                  </td>

                  <td>

                    {new Date(
                      submission.createdAt
                    ).toLocaleDateString()}

                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        onGrade(submission)
                      }
                    >

                      <FaEye />

                      View

                    </button>

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

export default StudentSubmissionTable;