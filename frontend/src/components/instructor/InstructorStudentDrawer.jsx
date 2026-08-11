import {
  FaUser,
  FaBookOpen,
  FaChartLine,
  FaGraduationCap,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

import "../../styles/InstructorStudentDrawer.css";

function InstructorStudentDrawer({
  open,
  onClose,
  studentData,
}) {
  if (!open || !studentData) return null;

  const student = studentData.student || {};
  const course = studentData.course || {};

  return (
    <>
      {/* Backdrop */}
      <div
        className="gmt-instructor-student-drawer-backdrop"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="gmt-instructor-student-drawer open">

        {/* Header */}
        <div className="gmt-instructor-student-drawer-header">

          <div>
            <h2>Student Details</h2>
            <p>Course performance and information</p>
          </div>

          <button
            className="gmt-instructor-student-drawer-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        {/* Profile */}
        <div className="gmt-instructor-student-profile-card">

          <div className="gmt-instructor-student-avatar-large">
            {student.name?.charAt(0).toUpperCase()}
          </div>

          <h3>{student.name}</h3>

          <p>{student.email}</p>

        </div>

        {/* Information Grid */}
        <div className="gmt-instructor-student-info-grid">

          <div className="gmt-instructor-student-info-card">
            <FaBookOpen />
            <div>
              <span>Course</span>
              <strong>{course.title}</strong>
            </div>
          </div>

          <div className="gmt-instructor-student-info-card">
            <FaGraduationCap />
            <div>
              <span>Course Code</span>
              <strong>{course.code}</strong>
            </div>
          </div>

          <div className="gmt-instructor-student-info-card">
            <FaChartLine />
            <div>
              <span>Progress</span>
              <strong>{studentData.progress || 0}%</strong>
            </div>
          </div>

          <div className="gmt-instructor-student-info-card">
            <FaGraduationCap />
            <div>
              <span>Final Score</span>
              <strong>{studentData.finalScore || 0}%</strong>
            </div>
          </div>

          <div className="gmt-instructor-student-info-card">
            <FaUser />
            <div>
              <span>Status</span>
              <strong>{studentData.status}</strong>
            </div>
          </div>

          <div className="gmt-instructor-student-info-card">
            <FaCalendarAlt />
            <div>
              <span>Last Activity</span>
              <strong>
                {studentData.lastActivity
                  ? new Date(studentData.lastActivity).toLocaleDateString()
                  : "N/A"}
              </strong>
            </div>
          </div>

        </div>

        {/* Progress */}
        <div className="gmt-instructor-student-progress-section">

          <div className="gmt-instructor-student-progress-header">

            <span>Course Progress</span>

            <strong>{studentData.progress || 0}%</strong>

          </div>

          <div className="gmt-instructor-student-progress-bar">

            <div
              className="gmt-instructor-student-progress-fill"
              style={{
                width: `${studentData.progress || 0}%`,
              }}
            />

          </div>

        </div>

      </div>
    </>
  );
}

export default InstructorStudentDrawer;