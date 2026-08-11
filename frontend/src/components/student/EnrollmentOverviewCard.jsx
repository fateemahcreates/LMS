import {
  FaBookOpen,
  FaUserTie,
  FaLayerGroup,
  FaCheckCircle,
} from "react-icons/fa";

import "../../styles/EnrollmentOverviewCard.css";

function EnrollmentOverviewCard({ enrollment }) {
  if (!enrollment) {
    return (
      <div className="enrollment-card">

        <div className="enrollment-empty">

          <FaBookOpen />

          <h3>No Active Enrollment</h3>

          <p>
            You are not currently enrolled in
            any programme.
          </p>

        </div>

      </div>
    );
  }

  const course = enrollment.course;

  return (
    <div className="enrollment-card">

      <span className="enrollment-tag">
        ENROLLMENT OVERVIEW
      </span>

      <h2>
        {course?.title}
      </h2>

      <p>
        Below is a summary of your current
        academic enrollment within GMT Tech Academy.
      </p>

      <div className="enrollment-grid">

        <div className="overview-item">

          <div className="overview-icon">
            <FaCheckCircle />
          </div>

          <div>

            <small>Status</small>

            <h5>
              {enrollment.status || "In Progress"}
            </h5>

          </div>

        </div>

        <div className="overview-item">

          <div className="overview-icon">
            <FaBookOpen />
          </div>

          <div>

            <small>Course Code</small>

            <h5>
              {course?.code || "N/A"}
            </h5>

          </div>

        </div>

        <div className="overview-item">

          <div className="overview-icon">
            <FaUserTie />
          </div>

          <div>

            <small>Instructor</small>

            <h5>
              {course?.instructor || "Not Assigned"}
            </h5>

          </div>

        </div>

        <div className="overview-item">

          <div className="overview-icon">
            <FaLayerGroup />
          </div>

          <div>

            <small>Category</small>

            <h5>
              {course?.category || "General"}
            </h5>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EnrollmentOverviewCard;