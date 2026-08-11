import {
  FaTimes,
  FaUserGraduate,
  FaBookOpen,
  FaCalendarAlt,
  FaClock,
  FaCertificate,
  FaCheckCircle,
} from "react-icons/fa";

import "../styles/EnrollmentDetailsDrawer.css";

function EnrollmentDetailsDrawer({
  open,
  enrollment,
  onClose,
  handleApprove,
}) {
  if (!enrollment) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const statusClass = enrollment.status
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <>
      {/* Overlay */}

      <div
        className={`drawer-overlay ${
          open ? "show" : ""
        }`}
        onClick={onClose}
      />

      {/* Drawer */}

      <aside
        className={`enrollment-drawer ${
          open ? "open" : ""
        }`}
      >
        {/* Header */}

        <div className="drawer-header">

          <div>

            <h2>Enrollment Details</h2>

            <p>
              Student learning timeline
            </p>

          </div>

          <button
            className="drawer-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        {/* Student */}

        <div className="drawer-section">

          <div className="section-title">

            <FaUserGraduate />

            <span>Student</span>

          </div>

          <div className="drawer-info">

            <div>

              <label>Name</label>

              <p>
                {enrollment.student?.name}
              </p>

            </div>

            <div>

              <label>Email</label>

              <p>
                {enrollment.student?.email}
              </p>

            </div>

          </div>

        </div>

        {/* Course */}

        <div className="drawer-section">

          <div className="section-title">

            <FaBookOpen />

            <span>Course</span>

          </div>

          <div className="drawer-info">

            <div>

              <label>Course</label>

              <p>
                {enrollment.course?.title}
              </p>

            </div>

            <div>

              <label>Category</label>

              <p>
                {enrollment.course?.category}
              </p>

            </div>

            <div>

              <label>Duration</label>

              <p>
                {enrollment.course?.duration}
              </p>

            </div>

          </div>

        </div>

        {/* Timeline */}

        <div className="drawer-section">

          <div className="section-title">

            <FaCalendarAlt />

            <span>Timeline</span>

          </div>

          <div className="drawer-info">

            <div>

              <label>Start Date</label>

              <p>
                {formatDate(
                  enrollment.startDate
                )}
              </p>

            </div>

            <div>

              <label>End Date</label>

              <p>
                {formatDate(
                  enrollment.endDate
                )}
              </p>

            </div>

            <div>

              <label>Days Remaining</label>

              <p>
                {enrollment.daysRemaining}
                {" "}
                days
              </p>

            </div>

          </div>

        </div>

        {/* Progress */}

        <div className="drawer-section">

          <div className="section-title">

            <FaClock />

            <span>Progress</span>

          </div>

          <div className="progress-wrapper">

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${enrollment.progress}%`,
                }}
              />

            </div>

            <span>
              {enrollment.progress}%
            </span>

          </div>

        </div>

        {/* Status */}

        <div className="drawer-section">

          <div className="drawer-info">

            <div>

              <label>Status</label>

              <span
                className={`status ${statusClass}`}
              >
                {enrollment.status}
              </span>

            </div>

            <div>

              <label>Certificate</label>

              {enrollment.certificateApproved ? (

                <span className="approved">

                  <FaCheckCircle />

                  Approved

                </span>

              ) : (

                <span className="pending">

                  <FaCertificate />

                  Pending

                </span>

              )}

            </div>

          </div>

        </div>

        {/* Footer */}

        {!enrollment.certificateApproved &&
          enrollment.progress === 100 && (

            <div className="drawer-footer">

              <button
                className="approve-btn"
                onClick={() =>
                  handleApprove(
                    enrollment._id
                  )
                }
              >
                Approve Certificate
              </button>

            </div>

          )}

      </aside>
    </>
  );
}

export default EnrollmentDetailsDrawer;