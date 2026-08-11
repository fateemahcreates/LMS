import { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";

import { getStudentAssignments } from "../../services/assignmentService";

import "../../styles/StudentDeadlines.css";

function StudentDeadlines() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const res = await getStudentAssignments();

      setAssignments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPriority = (dueDate) => {
    const today = new Date();

    const due = new Date(dueDate);

    const days = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (days <= 2) return "high";

    if (days <= 7) return "medium";

    return "low";
  };

  const getLabel = (dueDate) => {
    const today = new Date();

    const due = new Date(dueDate);

    const days = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    );

    if (days <= 0) return "Today";

    if (days === 1) return "Tomorrow";

    if (days < 7) return `${days} Days`;

    return due.toLocaleDateString();
  };

  return (
    <div className="student-deadlines">

      <div className="deadlines-header">

        <div>

          <span className="deadlines-tag">
            DEADLINES
          </span>

          <h2>Upcoming Deadlines</h2>

        </div>

        <span>
          {assignments.length} Tasks
        </span>

      </div>

      {assignments.length === 0 ? (
        <div className="empty-deadlines">

          <FaClipboardList />

          <h3>No Pending Assignments</h3>

          <p>
            You're all caught up. Great work!
          </p>

        </div>
      ) : (
        assignments.map((assignment) => {
          const priority = getPriority(
            assignment.dueDate
          );

          return (
            <div
              className="deadline-item"
              key={assignment._id}
            >
              <div className="deadline-left">

                <div
                  className={`deadline-indicator ${priority}`}
                ></div>

                <div className="deadline-info">

                  <h3>
                    {assignment.title}
                  </h3>

                  <p>
                    {assignment.course?.title}
                  </p>

                </div>

              </div>

              <div className="deadline-right">

                <span className="deadline-date">
                  {getLabel(
                    assignment.dueDate
                  )}
                </span>

                <span
                  className={`deadline-status ${priority}`}
                >
                  {priority}
                </span>

              </div>

            </div>
          );
        })
      )}

    </div>
  );
}

export default StudentDeadlines;