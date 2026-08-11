import { useState, useEffect } from "react";

import {
  FaTimes,
  FaUserGraduate,
  FaBookOpen,
  FaCalendarAlt,
  FaDownload,
  FaStar,
  FaCommentDots,
  FaSave,
} from "react-icons/fa";

import { notify } from "../utils/notify";

import "../styles/SubmissionDetailsDrawer.css";

function SubmissionDetailsDrawer({
  open,
  onClose,
  submission,
}) {
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  // ==========================================
  // UPDATE FORM WHEN SUBMISSION CHANGES
  // ==========================================

  useEffect(() => {
    if (submission) {
      setGrade(submission.score || "");
      setFeedback(submission.feedback || "");
    }
  }, [submission]);

  // ==========================================
  // SAVE GRADE
  // ==========================================

  const handleSave = async () => {
    try {
      /**
       * API integration goes here
       *
       * await gradeSubmission(
       *   submission._id,
       *   {
       *     score: grade,
       *     feedback,
       *   }
       * );
       */

      notify.success(
        "Submission graded successfully."
      );

      onClose();

    } catch (error) {
      console.error(error);

      notify.apiError(error);
    }
  };

  if (!submission) {
    return null;
  }

  return (
    <>
      {/* ==========================================
          OVERLAY
      ========================================== */}

      <div
        className={`submission-drawer-overlay ${
          open ? "show" : ""
        }`}
        onClick={onClose}
      />

      {/* ==========================================
          DRAWER
      ========================================== */}

      <aside
        className={`submission-details-drawer ${
          open ? "open" : ""
        }`}
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="submission-drawer-header">

          <div>
            <h2>
              Submission Review
            </h2>

            <p>
              Review, grade and provide
              feedback.
            </p>
          </div>

          <button
            type="button"
            className="submission-drawer-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>


        {/* ==========================================
            STUDENT INFORMATION
        ========================================== */}

        <div className="submission-drawer-section">

          <h3>
            <FaUserGraduate />
            Student Information
          </h3>

          <div className="submission-info-grid">

            <div className="submission-info-card">

              <label>
                Student Name
              </label>

              <p>
                {submission.student?.name || "N/A"}
              </p>

            </div>


            <div className="submission-info-card">

              <label>
                Email
              </label>

              <p>
                {submission.student?.email || "N/A"}
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
            ASSIGNMENT
        ========================================== */}

        <div className="submission-drawer-section">

          <h3>
            <FaBookOpen />
            Assignment
          </h3>

          <div className="submission-info-grid">

            <div className="submission-info-card">

              <label>
                Assignment
              </label>

              <p>
                {submission.assignment?.title || "N/A"}
              </p>

            </div>


            <div className="submission-info-card">

              <label>
                Course
              </label>

              <p>
                {submission.course?.title || "N/A"}
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
            SUBMISSION DETAILS
        ========================================== */}

        <div className="submission-drawer-section">

          <h3>
            <FaCalendarAlt />
            Submission Details
          </h3>

          <div className="submission-info-grid">

            <div className="submission-info-card">

              <label>
                Status
              </label>

              <p className="submission-status">
                {submission.status || "Pending"}
              </p>

            </div>


            <div className="submission-info-card">

              <label>
                Submitted On
              </label>

              <p>
                {submission.createdAt
                  ? new Date(
                      submission.createdAt
                    ).toLocaleString()
                  : "N/A"}
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
            STUDENT UPLOAD
        ========================================== */}

        <div className="submission-drawer-section">

          <h3>
            <FaDownload />
            Student Upload
          </h3>

          {submission.file ? (

            <a
              href={`http://localhost:5000/uploads/assignments/${submission.file}`}
              target="_blank"
              rel="noreferrer"
              className="submission-download-btn"
            >
              <FaDownload />

              Download Submission
            </a>

          ) : (

            <div className="submission-no-file">
              No uploaded file.
            </div>

          )}

        </div>


        {/* ==========================================
            GRADE
        ========================================== */}

        <div className="submission-drawer-section">

          <h3>
            <FaStar />
            Grade
          </h3>

          <div className="submission-input-group">

            <label>
              Score
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) =>
                setGrade(e.target.value)
              }
              placeholder="Enter score..."
            />

          </div>

        </div>


        {/* ==========================================
            FEEDBACK
        ========================================== */}

        <div className="submission-drawer-section">

          <h3>
            <FaCommentDots />
            Feedback
          </h3>

          <div className="submission-input-group">

            <label>
              Instructor Feedback
            </label>

            <textarea
              rows="6"
              value={feedback}
              onChange={(e) =>
                setFeedback(e.target.value)
              }
              placeholder="Write feedback for the student..."
            />

          </div>


          <button
            type="button"
            className="submission-save-btn"
            onClick={handleSave}
          >
            <FaSave />

            Save Grade
          </button>

        </div>

      </aside>
    </>
  );
}

export default SubmissionDetailsDrawer;