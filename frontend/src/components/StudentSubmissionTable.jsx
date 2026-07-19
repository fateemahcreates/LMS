import "../styles/StudentSubmissionTable.css";

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
          <h3>No Student Submissions Yet</h3>
          <p>
            Student uploads will appear here once
            assignments are submitted.
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
                <th>File</th>
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
                      {submission.student?.name || "Unknown"}
                    </strong>
                    <br />
                    <small>
                      {submission.student?.email}
                    </small>
                  </td>

                  <td>
                    {submission.course?.title || "--"}
                  </td>

                  <td>
                    {submission.assignment?.title ||
                      submission.title}
                  </td>

                  <td>
                    {submission.file ? (
                      <a
                       href={`http://localhost:5000/uploads/assignments/${submission.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-file-btn"
                      >
                        📄 View File
                      </a>
                    ) : (
                      <span className="no-file">
                        No File
                      </span>
                    )}
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
                    {submission.score !== null &&
                    submission.score !== undefined
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
                      className="grade-btn"
                      onClick={() =>
                        onGrade(submission)
                      }
                    >
                      {submission.status ===
                      "Graded"
                        ? "Edit Grade"
                        : "Grade"}
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