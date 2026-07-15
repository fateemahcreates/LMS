import "../../styles/StudentProfileCard.css";

import {
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaLayerGroup,
  FaIdBadge,
  FaUniversity,
  FaCalendarAlt,
} from "react-icons/fa";

function StudentProfileCard({ student }) {
  const user = student?.user || {};

  return (
    <div className="student-profile-card">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name
            ? user.name.charAt(0).toUpperCase()
            : "S"}
        </div>

        <div>
          <h2>{user.name || "Student Name"}</h2>

          <p>{user.role || "Student"}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        <div className="profile-item">
          <FaIdBadge />

          <div>
            <span>Student ID</span>

            <strong>
              {student?.studentId || "--"}
            </strong>
          </div>
        </div>

        <div className="profile-item">
          <FaBuilding />

          <div>
            <span>Department</span>

            <strong>
              {student?.department || "--"}
            </strong>
          </div>
        </div>

        <div className="profile-item">
          <FaUniversity />

          <div>
            <span>Faculty</span>

            <strong>
              {student?.faculty || "--"}
            </strong>
          </div>
        </div>

        <div className="profile-item">
          <FaLayerGroup />

          <div>
            <span>Level</span>

            <strong>
              {student?.level || "--"}
            </strong>
          </div>
        </div>

        <div className="profile-item">
          <FaCalendarAlt />

          <div>
            <span>Semester</span>

            <strong>
              {student?.semester || "--"}
            </strong>
          </div>
        </div>

        <div className="profile-item">
          <FaEnvelope />

          <div>
            <span>Email</span>

            <strong>
              {user.email || "--"}
            </strong>
          </div>
        </div>

        <div className="profile-item">
          <FaPhone />

          <div>
            <span>Phone</span>

            <strong>
              {student?.phone || "Not Added"}
            </strong>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="profile-footer">
        <div
          className={`status ${
            student?.status === "inactive"
              ? "inactive"
              : "active"
          }`}
        >
          <span></span>

          {student?.status === "inactive"
            ? "Inactive Student"
            : "Active Student"}
        </div>

        <button className="profile-btn">
          <FaUserGraduate />

          View Full Profile
        </button>
      </div>
    </div>
  );
}

export default StudentProfileCard;