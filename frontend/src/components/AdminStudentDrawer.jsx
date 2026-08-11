import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaGraduationCap,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";

import "../styles/AdminStudentDrawer.css";

function AdminStudentDrawer({
  open,
  onClose,
  student,
}) {
  if (!open || !student) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="gmt-admin-student-drawer-backdrop"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="gmt-admin-student-drawer open">

        {/* Header */}
        <div className="gmt-admin-student-drawer-header">

          <div>

            <h2>Student Details</h2>

            <p>
              View student profile and academy information.
            </p>

          </div>

          <button
            className="gmt-admin-student-close-btn"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        {/* Profile */}
        <div className="gmt-admin-student-profile">

          <div className="gmt-admin-student-avatar">

            {student.user?.name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

          <h3>{student.user?.name}</h3>

          <span>{student.user?.email}</span>

        </div>

        {/* Information */}
        <div className="gmt-admin-student-grid">

          <div className="gmt-admin-student-card">

            <FaIdCard />

            <div>

              <span>Student ID</span>

              <strong>{student.studentId}</strong>

            </div>

          </div>

          <div className="gmt-admin-student-card">

            <FaGraduationCap />

            <div>

              <span>Programme</span>

              <strong>{student.program}</strong>

            </div>

          </div>

          <div className="gmt-admin-student-card">

            <FaEnvelope />

            <div>

              <span>Email</span>

              <strong>{student.user?.email}</strong>

            </div>

          </div>

          <div className="gmt-admin-student-card">

            <FaPhone />

            <div>

              <span>Phone</span>

              <strong>
                {student.phone || "Not Available"}
              </strong>

            </div>

          </div>

          <div className="gmt-admin-student-card">

            <FaMapMarkerAlt />

            <div>

              <span>Address</span>

              <strong>
                {student.address || "Not Available"}
              </strong>

            </div>

          </div>

          <div className="gmt-admin-student-card">

            <FaCheckCircle />

            <div>

              <span>Status</span>

              <strong className={student.status}>
                {student.status}
              </strong>

            </div>

          </div>

          <div className="gmt-admin-student-card">

            <FaCalendarAlt />

            <div>

              <span>Joined</span>

              <strong>
                {new Date(
                  student.createdAt
                ).toLocaleDateString()}
              </strong>

            </div>

          </div>

          <div className="gmt-admin-student-card">

            <FaUser />

            <div>

              <span>Role</span>

              <strong>
                {student.user?.role}
              </strong>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default AdminStudentDrawer;