import { useState } from "react";

import {
  FaTimes,
  FaClipboardList,
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

import StudentSubmissionTable from "./StudentSubmissionTable";
import SubmissionDetailsDrawer from "./SubmissionDetailsDrawer";

import "../styles/AssignmentDetailsDrawer.css";

function AssignmentDetailsDrawer({
  open,
  onClose,
  assignment,
  submissions,
}) {
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [submissionDrawerOpen, setSubmissionDrawerOpen] =
    useState(false);

  if (!assignment) return null;

  // ==========================================
  // Filter submissions belonging to this assignment
  // ==========================================

  const assignmentSubmissions =
    submissions.filter(
      (submission) =>
        submission.assignment?._id === assignment._id
    );

  // ==========================================
  // Statistics
  // ==========================================

  const totalStudents =
    assignmentSubmissions.length;

  const submitted =
    assignmentSubmissions.filter(
      (submission) =>
        submission.status === "Submitted" ||
        submission.status === "Graded"
    ).length;

  const pending =
    totalStudents - submitted;

  const graded =
    assignmentSubmissions.filter(
      (submission) =>
        submission.score !== null &&
        submission.score !== undefined
    );

  const averageGrade =
    graded.length > 0
      ? Math.round(
          graded.reduce(
            (sum, submission) =>
              sum + Number(submission.score),
            0
          ) / graded.length
        )
      : 0;

  const submissionRate =
    totalStudents > 0
      ? Math.round(
          (submitted / totalStudents) * 100
        )
      : 0;

  // ==========================================
  // View Submission
  // ==========================================

  const handleViewSubmission = (
    submission
  ) => {
    setSelectedSubmission(submission);
    setSubmissionDrawerOpen(true);
  };

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
        className={`assignment-drawer ${
          open ? "open" : ""
        }`}
      >
        {/* ===================================== */}
        {/* HEADER */}
        {/* ===================================== */}

        <div className="drawer-header">
          <div>
            <h2>
              Assignment Details
            </h2>

            <p>
              View assignment
              information and student
              submissions.
            </p>
          </div>

          <button
            className="drawer-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* ===================================== */}
        {/* ASSIGNMENT DETAILS */}
        {/* ===================================== */}

        <div className="drawer-section">
          <div className="section-title">
            <FaClipboardList />
            Assignment Information
          </div>

          <div className="drawer-info">
            <div>
              <label>Title</label>

              <p>
                {assignment.title}
              </p>
            </div>

            <div>
              <label>Course</label>

              <p>
                {
                  assignment.course
                    ?.title
                }
              </p>
            </div>

            <div>
              <label>
                Description
              </label>

              <p>
                {
                  assignment.description
                }
              </p>
            </div>

            <div>
              <label>
                Due Date
              </label>

              <p>
                {new Date(
                  assignment.dueDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <label>
                Total Marks
              </label>

              <p>
                {
                  assignment.totalMarks
                }
              </p>
            </div>

            <div>
              <label>Status</label>

              <span
                className={`status ${assignment.status
                  .toLowerCase()
                  .replace(
                    /\s/g,
                    "-"
                  )}`}
              >
                {
                  assignment.status
                }
              </span>
            </div>
          </div>
        </div>

        {/* ===================================== */}
        {/* STATISTICS */}
        {/* ===================================== */}

        <div className="drawer-section">
          <div className="section-title">
            <FaChartLine />
            Assignment
            Statistics
          </div>

          <div className="drawer-stats">
            <div className="mini-stat">
              <FaUsers />

              <div>
                <h3>
                  {
                    totalStudents
                  }
                </h3>

                <span>
                  Total
                  Submissions
                </span>
              </div>
            </div>

            <div className="mini-stat">
              <FaBookOpen />

              <div>
                <h3>
                  {submitted}
                </h3>

                <span>
                  Submitted
                </span>
              </div>
            </div>

            <div className="mini-stat">
              <FaCalendarAlt />

              <div>
                <h3>
                  {pending}
                </h3>

                <span>
                  Pending
                </span>
              </div>
            </div>

            <div className="mini-stat">
              <FaChartLine />

              <div>
                <h3>
                  {
                    averageGrade
                  }
                  %
                </h3>

                <span>
                  Average
                  Score
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================== */}
        {/* PROGRESS */}
        {/* ===================================== */}

        <div className="drawer-section">
          <div className="section-title">
            Submission
            Progress
          </div>

          <div className="progress-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${submissionRate}%`,
                }}
              />
            </div>

            <span>
              {
                submissionRate
              }
              %
            </span>
          </div>
        </div>

        {/* ===================================== */}
        {/* SUBMISSIONS */}
        {/* ===================================== */}

        <div className="drawer-section">
          <div className="section-title">
            Student
            Submissions
          </div>

          <StudentSubmissionTable
            submissions={
              assignmentSubmissions
            }
            onGrade={
              handleViewSubmission
            }
          />
        </div>
      </aside>

      {/* ===================================== */}
      {/* SUBMISSION DRAWER */}
      {/* ===================================== */}

      <SubmissionDetailsDrawer
        open={
          submissionDrawerOpen
        }
        onClose={() =>
          setSubmissionDrawerOpen(
            false
          )
        }
        submission={
          selectedSubmission
        }
      />
    </>
  );
}

export default AssignmentDetailsDrawer;