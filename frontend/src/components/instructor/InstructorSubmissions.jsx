import { useEffect, useState } from "react";

import {
  FaClipboardCheck,
  FaFileAlt,
  FaBookOpen,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaTimes,
  FaSave,
  FaGraduationCap,
} from "react-icons/fa";

import {
  getInstructorSubmissions,
  gradeInstructorSubmission,
} from "../../services/SubmissionService";

import "../../styles/InstructorSubmissions.css";

function InstructorSubmissions() {
  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const [showDrawer, setShowDrawer] = useState(false);

  const [formData, setFormData] = useState({
    score: "",
    feedback: "",
  });

  // ==========================================
  // LOAD SUBMISSIONS
  // ==========================================

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);

      const res = await getInstructorSubmissions();

      console.log(
        "========== INSTRUCTOR SUBMISSIONS =========="
      );

      console.log(res.data);

      setSubmissions(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load instructor submissions:",
        error
      );

      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN SUBMISSION
  // ==========================================

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);

    setFormData({
      score:
        submission.score !== undefined &&
        submission.score !== null
          ? submission.score
          : "",

      feedback:
        submission.feedback || "",
    });

    setShowDrawer(true);
  };

  // ==========================================
  // CLOSE DRAWER
  // ==========================================

  const handleCloseDrawer = () => {
    if (saving) return;

    setShowDrawer(false);
    setSelectedSubmission(null);

    setFormData({
      score: "",
      feedback: "",
    });
  };

  // ==========================================
  // GRADE SUBMISSION
  // ==========================================

  const handleGrade = async (e) => {
    e.preventDefault();

    if (!selectedSubmission) {
      return;
    }

    if (
      formData.score === "" ||
      formData.score === null
    ) {
      alert("Please enter a score.");

      return;
    }

    const score = Number(formData.score);

    const totalMarks =
      Number(
        selectedSubmission.assignment
          ?.totalMarks
      ) || 100;

    if (score < 0) {
      alert(
        "Score cannot be less than 0."
      );

      return;
    }

    if (score > totalMarks) {
      alert(
        `Score cannot be greater than ${totalMarks}.`
      );

      return;
    }

    try {
      setSaving(true);

      await gradeInstructorSubmission(
        selectedSubmission._id,
        {
          score,
          feedback:
            formData.feedback.trim(),
        }
      );

      alert(
        "Submission graded successfully."
      );

      handleCloseDrawer();

      await loadSubmissions();
    } catch (error) {
      console.error(
        "Unable to grade submission:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to grade submission."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalSubmissions =
    submissions.length;

  const pendingSubmissions =
    submissions.filter(
      (submission) =>
        submission.status !== "Graded"
    ).length;

  const gradedSubmissions =
    submissions.filter(
      (submission) =>
        submission.status === "Graded"
    ).length;

  const uniqueStudents = new Set(
    submissions
      .map(
        (submission) =>
          submission.student?._id ||
          submission.student
      )
      .filter(Boolean)
  ).size;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(
      date
    ).toLocaleDateString();
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="instructor-submissions-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <section className="instructor-submission-header">

        <div className="instructor-submission-header-content">

          <div className="instructor-submission-heading-icon">
            <FaClipboardCheck />
          </div>

          <div>
            <h1>
              Student Submissions
            </h1>

            <p>
              Review, grade and provide
              feedback on student
              assignments.
            </p>
          </div>

        </div>

      </section>


      {/* =====================================
          STATISTICS
      ====================================== */}

      <section className="instructor-submission-stats">

        {/* TOTAL */}

        <div className="instructor-submission-stat-card">

          <div className="instructor-submission-stat-icon">
            <FaClipboardCheck />
          </div>

          <div>
            <span>
              Total Submissions
            </span>

            <strong>
              {totalSubmissions}
            </strong>
          </div>

        </div>


        {/* PENDING */}

        <div className="instructor-submission-stat-card">

          <div className="instructor-submission-stat-icon">
            <FaClock />
          </div>

          <div>
            <span>
              Pending Review
            </span>

            <strong>
              {pendingSubmissions}
            </strong>
          </div>

        </div>


        {/* GRADED */}

        <div className="instructor-submission-stat-card">

          <div className="instructor-submission-stat-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>
              Graded
            </span>

            <strong>
              {gradedSubmissions}
            </strong>
          </div>

        </div>


        {/* STUDENTS */}

        <div className="instructor-submission-stat-card">

          <div className="instructor-submission-stat-icon">
            <FaUser />
          </div>

          <div>
            <span>
              Students
            </span>

            <strong>
              {uniqueStudents}
            </strong>
          </div>

        </div>

      </section>


      {/* =====================================
          SUBMISSIONS SECTION
      ====================================== */}

      <section className="instructor-submission-section">

        <div className="instructor-submission-section-header">

          <div>
            <h2>
              Student Assignment Submissions
            </h2>

            <p>
              Review work submitted by
              students enrolled in your
              courses.
            </p>
          </div>

          <span className="instructor-submission-count">
            {totalSubmissions}
          </span>

        </div>


        {/* =====================================
            LOADING
        ====================================== */}

        {loading ? (

          <div className="instructor-submission-loading">

            <FaClipboardCheck />

            <p>
              Loading student
              submissions...
            </p>

          </div>

        ) : submissions.length === 0 ? (

          /* =====================================
             EMPTY
          ====================================== */

          <div className="instructor-submission-empty">

            <div className="instructor-submission-empty-icon">
              <FaFileAlt />
            </div>

            <h3>
              No Student Submissions Yet
            </h3>

            <p>
              Student assignment
              submissions will appear
              here once they are
              submitted.
            </p>

          </div>

        ) : (

          /* =====================================
             TABLE
          ====================================== */

          <div className="instructor-submission-table-wrapper">

            <table className="instructor-submission-table">

              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Assignment
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Submitted
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {submissions.map(
                  (submission) => {

                    const totalMarks =
                      submission.assignment
                        ?.totalMarks ||
                      100;

                    return (

                      <tr
                        key={
                          submission._id
                        }
                      >

                        {/* STUDENT */}

                        <td>

                          <div className="instructor-submission-student">

                            <div className="instructor-submission-avatar">
                              <FaUser />
                            </div>

                            <div>

                              <strong>
                                {
                                  submission
                                    .student
                                    ?.name ||
                                  "Unknown Student"
                                }
                              </strong>

                              <span>
                                {
                                  submission
                                    .student
                                    ?.email ||
                                  "No email"
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* ASSIGNMENT */}

                        <td>

                          <div className="instructor-submission-assignment">

                            <FaClipboardCheck />

                            <div>

                              <strong>
                                {
                                  submission
                                    .assignment
                                    ?.title ||
                                  submission
                                    .title ||
                                  "Assignment"
                                }
                              </strong>

                              <span>
                                {
                                  submission
                                    .assignment
                                    ?.submissionType ||
                                  "Online"
                                }
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* COURSE */}

                        <td>

                          <div className="instructor-submission-course">

                            <FaBookOpen />

                            <span>
                              {
                                submission
                                  .course
                                  ?.title ||
                                "Course"
                              }
                            </span>

                          </div>

                        </td>


                        {/* DATE */}

                        <td>

                          <span className="instructor-submission-date">

                            <FaClock />

                            {formatDate(
                              submission.createdAt
                            )}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`instructor-submission-status ${
                              submission.status
                                ?.toLowerCase()
                                .replace(
                                  /\s/g,
                                  "-"
                                ) ||
                              "pending"
                            }`}
                          >

                            {submission.status ===
                            "Graded" ? (
                              <FaCheckCircle />
                            ) : (
                              <FaClock />
                            )}

                            {
                              submission.status ||
                              "Pending"
                            }

                          </span>

                        </td>


                        {/* SCORE */}

                        <td>

                          <div className="instructor-submission-score">

                            {submission.score !==
                              undefined &&
                            submission.score !==
                              null ? (

                              <>
                                <strong>
                                  {
                                    submission.score
                                  }
                                </strong>

                                <span>
                                  /
                                  {
                                    totalMarks
                                  }
                                </span>
                              </>

                            ) : (

                              <span>
                                Not graded
                              </span>

                            )}

                          </div>

                        </td>


                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="instructor-submission-view-btn"
                            onClick={() =>
                              handleViewSubmission(
                                submission
                              )
                            }
                          >

                            <FaEye />

                            {submission.status ===
                            "Graded"
                              ? "View"
                              : "Review"}

                          </button>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* =====================================
          GRADING DRAWER
      ====================================== */}

      {showDrawer &&
        selectedSubmission && (

          <>

            {/* OVERLAY */}

            <div
              className="instructor-submission-overlay"
              onClick={
                handleCloseDrawer
              }
            />


            {/* DRAWER */}

            <aside className="instructor-submission-drawer">

              {/* DRAWER HEADER */}

              <div className="instructor-submission-drawer-header">

                <div>

                  <h2>
                    Review Submission
                  </h2>

                  <p>
                    Review the student's
                    submission and assign
                    a grade.
                  </p>

                </div>

                <button
                  type="button"
                  className="instructor-submission-close-btn"
                  onClick={
                    handleCloseDrawer
                  }
                >
                  <FaTimes />
                </button>

              </div>


              {/* STUDENT INFO */}

              <div className="instructor-submission-profile">

                <div className="instructor-submission-profile-avatar">
                  <FaGraduationCap />
                </div>

                <div>

                  <span>
                    Student
                  </span>

                  <strong>
                    {
                      selectedSubmission
                        .student
                        ?.name ||
                      "Unknown Student"
                    }
                  </strong>

                  <small>
                    {
                      selectedSubmission
                        .student
                        ?.email ||
                      "No email available"
                    }
                  </small>

                </div>

              </div>


              {/* ASSIGNMENT INFO */}

              <div className="instructor-submission-info-card">

                <div className="instructor-submission-info-row">

                  <span>
                    Assignment
                  </span>

                  <strong>
                    {
                      selectedSubmission
                        .assignment
                        ?.title ||
                      selectedSubmission
                        .title ||
                      "Assignment"
                    }
                  </strong>

                </div>


                <div className="instructor-submission-info-row">

                  <span>
                    Course
                  </span>

                  <strong>
                    {
                      selectedSubmission
                        .course
                        ?.title ||
                      "Course"
                    }
                  </strong>

                </div>


                <div className="instructor-submission-info-row">

                  <span>
                    Due Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedSubmission
                        .assignment
                        ?.dueDate
                    )}
                  </strong>

                </div>


                <div className="instructor-submission-info-row">

                  <span>
                    Submitted
                  </span>

                  <strong>
                    {formatDate(
                      selectedSubmission
                        .createdAt
                    )}
                  </strong>

                </div>


                <div className="instructor-submission-info-row">

                  <span>
                    Total Marks
                  </span>

                  <strong>
                    {
                      selectedSubmission
                        .assignment
                        ?.totalMarks ||
                      100
                    }
                  </strong>

                </div>

              </div>


              {/* DESCRIPTION */}

              {selectedSubmission.description && (

                <div className="instructor-submission-description">

                  <h3>
                    Student Description
                  </h3>

                  <p>
                    {
                      selectedSubmission.description
                    }
                  </p>

                </div>

              )}


              {/* FILE */}

              {selectedSubmission.file && (

                <div className="instructor-submission-file">

                  <div className="instructor-submission-file-icon">
                    <FaFileAlt />
                  </div>

                  <div>

                    <span>
                      Submitted File
                    </span>

                    <strong>
                      {
                        selectedSubmission.file
                      }
                    </strong>

                  </div>

                  <a
                    href={
                      selectedSubmission.file.startsWith(
                        "http"
                      )
                        ? selectedSubmission.file
                        : `/uploads/${selectedSubmission.file}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="instructor-submission-file-btn"
                  >
                    <FaEye />
                    View
                  </a>

                </div>

              )}


              {/* GRADING FORM */}

              <form
                className="instructor-submission-grade-form"
                onSubmit={handleGrade}
              >

                <div className="instructor-submission-form-group">

                  <label>
                    Score
                  </label>

                  <div className="instructor-submission-score-input">

                    <input
                      type="number"
                      name="score"
                      min="0"
                      max={
                        selectedSubmission
                          .assignment
                          ?.totalMarks ||
                        100
                      }
                      value={
                        formData.score
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter score"
                      required
                    />

                    <span>
                      /
                      {
                        selectedSubmission
                          .assignment
                          ?.totalMarks ||
                        100
                      }
                    </span>

                  </div>

                </div>


                <div className="instructor-submission-form-group">

                  <label>
                    Feedback
                  </label>

                  <textarea
                    name="feedback"
                    rows="5"
                    value={
                      formData.feedback
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Provide feedback to the student..."
                  />

                </div>


                {/* ACTIONS */}

                <div className="instructor-submission-form-actions">

                  <button
                    type="button"
                    className="instructor-submission-cancel-btn"
                    onClick={
                      handleCloseDrawer
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="instructor-submission-save-btn"
                    disabled={saving}
                  >

                    {saving ? (
                      <>
                        <FaClock />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Grade
                      </>
                    )}

                  </button>

                </div>

              </form>

            </aside>

          </>

        )}

    </main>
  );
}

export default InstructorSubmissions;