import "../../styles/AcademicProgressCard.css";

function AcademicProgressCard({ enrollment }) {
  if (!enrollment) {
    return (
      <div className="progress-card empty-progress">
        <h3>No Active Course</h3>
        <p>You haven't enrolled in a course yet.</p>
      </div>
    );
  }

  const {
    course,
    progress,
    startDate,
    endDate,
    daysRemaining,
    status,
  } = enrollment;

  return (
    <div className="progress-card">

      <div className="progress-header">

        <div>
          <h2>My Academic Progress</h2>
          <h3>{course?.title}</h3>
        </div>

        <div className="progress-percent">
          {progress}%
        </div>

      </div>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="progress-details">

        <div className="detail">
          <span>Started</span>
          <strong>
            {new Date(startDate).toLocaleDateString()}
          </strong>
        </div>

        <div className="detail">
          <span>Expected Completion</span>
          <strong>
            {new Date(endDate).toLocaleDateString()}
          </strong>
        </div>

        <div className="detail">
          <span>Days Remaining</span>
          <strong>{daysRemaining} Days</strong>
        </div>

        <div className="detail">
          <span>Duration</span>
          <strong>{course?.duration}</strong>
        </div>

        <div className="detail">
          <span>Status</span>

          <strong
            className={`status ${status
              .toLowerCase()
              .replace(/\s/g, "-")}`}
          >
            {status}
          </strong>
        </div>

      </div>

    </div>
  );
}

export default AcademicProgressCard;