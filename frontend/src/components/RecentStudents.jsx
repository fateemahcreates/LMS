import { FaUserGraduate } from "react-icons/fa";

import "../styles/RecentStudents.css";

function RecentStudents({ students = [] }) {
  // Show only the latest 5 students
  const recentStudents = students.slice(-5).reverse();

  return (
    <div className="recent-card">
      <div className="recent-header">
        <h2>Recent Students</h2>

        <span>{recentStudents.length}</span>
      </div>

      {recentStudents.length === 0 ? (
        <div className="empty-recent">
          <FaUserGraduate className="empty-icon" />

          <p>No students found.</p>
        </div>
      ) : (
        <div className="recent-list">
          {recentStudents.map((student) => (
            <div
              className="recent-item"
              key={student._id}
            >
              <div className="student-avatar">
                {student.user?.name?.charAt(0).toUpperCase() || "?"}
              </div>

              <div className="student-info">
                <h4>{student.user?.name || "Unknown Student"}</h4>

                <p>{student.department}</p>

                <small>Level {student.level}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentStudents;