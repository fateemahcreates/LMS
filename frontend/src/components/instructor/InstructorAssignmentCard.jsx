import {
  FaEdit,
  FaTrash,
  FaBook,
  FaCalendarAlt,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";

import "../../styles/InstructorAssignmentCard.css";

function InstructorAssignmentCard({
  assignment,
  onEdit,
  onDelete,
}) {
  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formattedDate = assignment?.dueDate
    ? new Date(
        assignment.dueDate
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "No due date";


  // ==========================================
  // CHECK DEADLINE
  // ==========================================

  const isPastDue =
    assignment?.dueDate &&
    new Date(assignment.dueDate) < new Date();


  // ==========================================
  // STATUS
  // ==========================================

  const status =
    assignment?.status || "Active";


  return (
    <article className="instructor-assignment-card">

      {/* =====================================
          CARD HEADER
      ====================================== */}

      <div className="instructor-assignment-card-header">

        <div className="instructor-assignment-icon">
          <FaFileAlt />
        </div>

        <div className="instructor-assignment-status-wrapper">

          <span
            className={`instructor-assignment-status ${
              status.toLowerCase()
            }`}
          >
            {status}
          </span>

        </div>

      </div>


      {/* =====================================
          TITLE
      ====================================== */}

      <div className="instructor-assignment-card-content">

        <h3>
          {assignment?.title ||
            "Untitled Assignment"}
        </h3>


        {/* ===================================
            DESCRIPTION
        ==================================== */}

        <p className="instructor-assignment-description">

          {assignment?.description
            ? assignment.description
            : "No description provided."}

        </p>


        {/* ===================================
            COURSE
        ==================================== */}

        <div className="instructor-assignment-info">

          <div className="instructor-assignment-info-item">

            <FaBook />

            <span>

              {assignment?.course?.title ||
                "Course unavailable"}

            </span>

          </div>


          {/* =================================
              DUE DATE
          ================================== */}

          <div
            className={`instructor-assignment-info-item ${
              isPastDue
                ? "past-due"
                : ""
            }`}
          >

            <FaCalendarAlt />

            <span>
              {formattedDate}
            </span>

          </div>


          {/* =================================
              TOTAL MARKS
          ================================== */}

          <div className="instructor-assignment-info-item">

            <FaClock />

            <span>

              {assignment?.totalMarks ?? 100} Marks

            </span>

          </div>

        </div>


        {/* =====================================
            SUBMISSION TYPE
        ====================================== */}

        <div className="instructor-assignment-meta">

          <span>
            Submission:
          </span>

          <strong>
            {assignment?.submissionType ||
              "Online"}
          </strong>

        </div>

      </div>


      {/* =====================================
          ACTIONS
      ====================================== */}

      <div className="instructor-assignment-actions">

        <button
          type="button"
          className="instructor-assignment-edit-btn"
          onClick={() =>
            onEdit(assignment)
          }
        >
          <FaEdit />
          Edit
        </button>


        <button
          type="button"
          className="instructor-assignment-delete-btn"
          onClick={() =>
            onDelete(assignment._id)
          }
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </article>
  );
}

export default InstructorAssignmentCard;