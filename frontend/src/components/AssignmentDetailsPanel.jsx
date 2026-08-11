import {
  FaBookOpen,
  FaCalendarAlt,
  FaClipboardCheck,
  FaUsers,
  FaCheckCircle,
  FaHourglassHalf,
  FaEye,
} from "react-icons/fa";

import "../styles/AssignmentDetailsPanel.css";

function AssignmentDetailsPanel({
  assignment,
  submissions,
  onReview,
}) {
  const submitted = submissions.length;

  const graded = submissions.filter(
    (submission) => submission.status === "Graded"
  ).length;

  const pending = submitted - graded;

  const averageScore =
    graded > 0
      ? Math.round(
          submissions
            .filter(
              (submission) =>
                submission.score !== null &&
                submission.score !== undefined
            )
            .reduce(
              (sum, submission) =>
                sum + submission.score,
              0
            ) / graded
        )
      : 0;

  return (
    <section className="assignment-details-panel">

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <div className="details-header">

        <div>

          <h2>{assignment.title}</h2>

          <p>{assignment.description}</p>

        </div>

      </div>

      {/* ========================= */}
      {/* Assignment Info */}
      {/* ========================= */}

      <div className="assignment-info-grid">

        <div className="info-card">

          <FaBookOpen />

          <div>

            <span>Course</span>

            <strong>
              {assignment.course?.title}
            </strong>

          </div>

        </div>

        <div className="info-card">

          <FaCalendarAlt />

          <div>

            <span>Due Date</span>

            <strong>
              {new Date(
                assignment.dueDate
              ).toLocaleDateString()}
            </strong>

          </div>

        </div>

        <div className="info-card">

          <FaClipboardCheck />

          <div>

            <span>Total Marks</span>

            <strong>
              {assignment.totalMarks}
            </strong>

          </div>

        </div>

        <div className="info-card">

          <FaCheckCircle />

          <div>

            <span>Status</span>

            <strong>
              {assignment.status}
            </strong>

          </div>

        </div>

      </div>

      {/* ========================= */}
      {/* Statistics */}
      {/* ========================= */}

      <div className="assignment-stats">

        <div className="stat-box">

          <FaUsers />

          <h3>{submitted}</h3>

          <span>Submitted</span>

        </div>

        <div className="stat-box">

          <FaCheckCircle />

          <h3>{graded}</h3>

          <span>Graded</span>

        </div>

        <div className="stat-box">

          <FaHourglassHalf />

          <h3>{pending}</h3>

          <span>Pending</span>

        </div>

        <div className="stat-box">

          <FaClipboardCheck />

          <h3>{averageScore}%</h3>

          <span>Average</span>

        </div>

      </div>

      {/* ========================= */}
      {/* Student Submissions */}
      {/* ========================= */}

      <div className="submissions-section">

        <h3>Student Submissions</h3>

        {submissions.length === 0 ? (

  <div className="empty-submissions">
    <p>No submissions yet for this assignment.</p>
  </div>

) : (

  <>

    {/* Desktop Table */}

    <div className="submissions-table">

      <table>

        <thead>
          <tr>
            <th>Student</th>
            <th>Status</th>
            <th>Score</th>
            <th>Submitted</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {submissions.map((submission) => (

            <tr key={submission._id}>

              <td>
                <strong>{submission.student?.name}</strong>
                <br />
                <small>{submission.student?.email}</small>
              </td>

              <td>
                <span
                  className={`submission-status ${submission.status
                    ?.toLowerCase()
                    .replace(/\s/g, "-")}`}
                >
                  {submission.status}
                </span>
              </td>

              <td>{submission.score ?? "--"}</td>

              <td>
                {new Date(
                  submission.createdAt
                ).toLocaleDateString()}
              </td>

              <td>

                <button
                  className="review-btn"
                  onClick={() => onReview(submission)}
                >
                  <FaEye />
                  Review
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

    {/* Mobile Cards */}

    <div className="mobile-submissions">

      {submissions.map((submission) => (

        <div
          className="submission-card"
          key={submission._id}
        >

          <h4>{submission.student?.name}</h4>

          <p>
            <strong>Email:</strong>{" "}
            {submission.student?.email}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {submission.status}
          </p>

          <p>
            <strong>Score:</strong>{" "}
            {submission.score ?? "--"}
          </p>

          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(
              submission.createdAt
            ).toLocaleDateString()}
          </p>

          <button
            className="review-btn"
            onClick={() => onReview(submission)}
          >
            <FaEye />
            Review
          </button>

        </div>

      ))}

    </div>

  </>

)}

      </div>

    </section>
  );
}

export default AssignmentDetailsPanel;