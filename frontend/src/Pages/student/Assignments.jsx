import { useEffect, useState } from "react";

import {
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  FaBookOpen,
  FaCalendarAlt,
  FaTimes,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";

import { getPublishedCourses } from "../../services/courseService";

import {
  submitAssignment,
  getMySubmissions,
} from "../../services/SubmissionService";

import {
  getStudentAssignments,
} from "../../services/assignmentService";

import "../../styles/StudentAssignments.css";

function StudentAssignments() {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [academyAssignments, setAcademyAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assignmentsLoading, setAssignmentsLoading] =
    useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [assignmentError, setAssignmentError] =
    useState("");

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [showSubmitForm, setShowSubmitForm] =
    useState(false);

  const [formData, setFormData] = useState({
    course: "",
    title: "",
    description: "",
    file: null,
  });

  // ==========================================
  // LOAD ALL DATA
  // ==========================================

  useEffect(() => {
    loadCourses();
    loadSubmissions();
    loadAcademyAssignments();
  }, []);

  // ==========================================
  // LOAD PUBLISHED COURSES
  // ==========================================

  const loadCourses = async () => {
    try {
      const res = await getPublishedCourses();

      console.log(
        "========== STUDENT COURSES =========="
      );

      console.log(res.data);

      setCourses(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "STUDENT COURSES ERROR:",
        error
      );

      setCourses([]);
    }
  };

  // ==========================================
  // LOAD SUBMISSIONS
  // ==========================================

  const loadSubmissions = async () => {
    try {
      setLoading(true);

      const res = await getMySubmissions();

      console.log(
        "========== STUDENT SUBMISSIONS =========="
      );

      console.log(res.data);

      setSubmissions(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "STUDENT SUBMISSIONS ERROR:",
        error
      );

      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD STUDENT ASSIGNMENTS
  // ==========================================

  const loadAcademyAssignments = async () => {
    try {
      setAssignmentsLoading(true);
      setAssignmentError("");

      console.log(
        "========== LOADING STUDENT ASSIGNMENTS =========="
      );

      const res = await getStudentAssignments();

      console.log(
        "STUDENT ASSIGNMENTS RESPONSE:",
        res
      );

      console.log(
        "STUDENT ASSIGNMENTS DATA:",
        res.data
      );

      /*
        Backend normally returns:

        [
          {
            _id,
            title,
            description,
            course,
            dueDate,
            totalMarks,
            submissionType,
            status
          }
        ]
      */

      if (Array.isArray(res.data)) {
        setAcademyAssignments(res.data);
      } else if (
        Array.isArray(res.data?.assignments)
      ) {
        setAcademyAssignments(
          res.data.assignments
        );
      } else {
        console.warn(
          "Unexpected assignment response:",
          res.data
        );

        setAcademyAssignments([]);
      }
    } catch (error) {
      console.error(
        "STUDENT ASSIGNMENTS ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      setAcademyAssignments([]);

      setAssignmentError(
        error.response?.data?.message ||
          "Unable to load assignments."
      );
    } finally {
      setAssignmentsLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;

    if (name === "file") {
      setFormData((previous) => ({
        ...previous,
        file: files?.[0] || null,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SELECT ASSIGNMENT
  // ==========================================

  const handleSelectAssignment = (
    assignment
  ) => {
    setSelectedAssignment(assignment);

    setFormData({
      course:
        assignment.course?._id ||
        assignment.course ||
        "",

      title:
        assignment.title || "",

      description:
        assignment.description || "",

      file: null,
    });

    setShowSubmitForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    if (submitting) return;

    setShowSubmitForm(false);

    setSelectedAssignment(null);

    setFormData({
      course: "",
      title: "",
      description: "",
      file: null,
    });

    const fileInput =
      document.getElementById(
        "student-assignment-file"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ==========================================
  // SUBMIT ASSIGNMENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.course ||
      !formData.title.trim() ||
      !formData.file
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append(
        "course",
        formData.course
      );

      if (selectedAssignment) {
        data.append(
          "assignment",
          selectedAssignment._id
        );
      }

      data.append(
        "title",
        formData.title
      );

      data.append(
        "description",
        formData.description
      );

      data.append(
        "file",
        formData.file
      );

      console.log(
        "========== SUBMITTING ASSIGNMENT =========="
      );

      console.log({
        course: formData.course,
        assignment:
          selectedAssignment?._id,
        title: formData.title,
        file: formData.file?.name,
      });

      await submitAssignment(data);

      alert(
        "Assignment submitted successfully!"
      );

      handleCloseForm();

      await loadSubmissions();
    } catch (error) {
      console.error(
        "ASSIGNMENT SUBMISSION ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to submit assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalAssignments =
    academyAssignments.length;

  const submittedAssignmentIds =
    submissions
      .map(
        (submission) =>
          submission.assignment?._id ||
          submission.assignment
      )
      .filter(Boolean);

  const submittedCount =
    academyAssignments.filter(
      (assignment) =>
        submittedAssignmentIds.includes(
          assignment._id
        )
    ).length;

  const pendingCount = Math.max(
    totalAssignments -
      submittedCount,
    0
  );

  const gradedCount =
    submissions.filter(
      (submission) =>
        submission.status === "Graded"
    ).length;

  // ==========================================
  // CHECK SUBMISSION
  // ==========================================

  const isAssignmentSubmitted = (
    assignmentId
  ) => {
    return submittedAssignmentIds.includes(
      assignmentId
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="student-assignments-page">

      {/* ======================================
          PAGE HEADER
      ======================================= */}

      <section className="student-assignment-header">

        <div className="student-assignment-header-content">

          <div className="student-assignment-heading-icon">
            <FaClipboardList />
          </div>

          <div>
            <h1>
              Assignments
            </h1>

            <p>
              View your coursework, submit
              assignments, and monitor your
              submission progress.
            </p>
          </div>

        </div>

      </section>


      {/* ======================================
          STATISTICS
      ======================================= */}

      <section className="student-assignment-stats">

        <div className="student-assignment-stat-card">

          <div className="student-assignment-stat-icon">
            <FaClipboardList />
          </div>

          <div>
            <span>
              Total Assignments
            </span>

            <strong>
              {totalAssignments}
            </strong>
          </div>

        </div>


        <div className="student-assignment-stat-card">

          <div className="student-assignment-stat-icon">
            <FaUpload />
          </div>

          <div>
            <span>
              Submitted
            </span>

            <strong>
              {submittedCount}
            </strong>
          </div>

        </div>


        <div className="student-assignment-stat-card">

          <div className="student-assignment-stat-icon">
            <FaClock />
          </div>

          <div>
            <span>
              Pending
            </span>

            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        <div className="student-assignment-stat-card">

          <div className="student-assignment-stat-icon">
            <FaCheckCircle />
          </div>

          <div>
            <span>
              Graded
            </span>

            <strong>
              {gradedCount}
            </strong>
          </div>

        </div>

      </section>


      {/* ======================================
          AVAILABLE ASSIGNMENTS
      ======================================= */}

      <section className="student-assignment-section">

        <div className="student-assignment-section-header">

          <div>
            <h2>
              Available Assignments
            </h2>

            <p>
              Assignments from courses you
              are currently enrolled in.
            </p>
          </div>

          <span className="student-assignment-count">
            {totalAssignments}
          </span>

        </div>


        {/* ASSIGNMENT LOADING */}

        {assignmentsLoading ? (

          <div className="student-assignment-loading">

            <FaClipboardList />

            <p>
              Loading assignments...
            </p>

          </div>

        ) : assignmentError ? (

          <div className="student-assignment-empty">

            <div className="student-assignment-empty-icon">
              <FaExclamationTriangle />
            </div>

            <h3>
              Unable to Load Assignments
            </h3>

            <p>
              {assignmentError}
            </p>

            <button
              type="button"
              className="student-assignment-submit-btn"
              onClick={loadAcademyAssignments}
            >
              Try Again
            </button>

          </div>

        ) : academyAssignments.length === 0 ? (

          <div className="student-assignment-empty">

            <div className="student-assignment-empty-icon">
              <FaClipboardList />
            </div>

            <h3>
              No Assignments Available
            </h3>

            <p>
              You currently have no assignments
              available for submission.
            </p>

          </div>

        ) : (

          <div className="student-assignment-grid">

            {academyAssignments.map(
              (assignment) => {

                const submitted =
                  isAssignmentSubmitted(
                    assignment._id
                  );

                return (
                  <article
                    key={assignment._id}
                    className="student-assignment-card"
                  >

                    {/* CARD TOP */}

                    <div className="student-assignment-card-top">

                      <div className="student-assignment-card-icon">
                        <FaClipboardList />
                      </div>

                      <span
                        className={`student-assignment-status ${
                          submitted
                            ? "submitted"
                            : assignment.status?.toLowerCase()
                        }`}
                      >
                        {submitted
                          ? "Submitted"
                          : assignment.status ||
                            "Active"}
                      </span>

                    </div>


                    {/* TITLE */}

                    <h3>
                      {assignment.title}
                    </h3>


                    {/* DESCRIPTION */}

                    <p className="student-assignment-description">
                      {assignment.description ||
                        "No description provided."}
                    </p>


                    {/* DETAILS */}

                    <div className="student-assignment-details">

                      <div>
                        <FaBookOpen />

                        <span>
                          {assignment.course?.title ||
                            "Course unavailable"}
                        </span>
                      </div>


                      <div>
                        <FaCalendarAlt />

                        <span>
                          Due:{" "}
                          {assignment.dueDate
                            ? new Date(
                                assignment.dueDate
                              ).toLocaleDateString()
                            : "No due date"}
                        </span>
                      </div>


                      <div>
                        <FaClipboardList />

                        <span>
                          {assignment.totalMarks ||
                            100}{" "}
                          Marks
                        </span>
                      </div>

                    </div>


                    {/* FOOTER */}

                    <div className="student-assignment-card-footer">

                      <span>
                        {assignment.submissionType ||
                          "Online"}
                      </span>


                      {submitted ? (

                        <span className="student-assignment-submitted-label">

                          <FaCheckCircle />

                          Submitted

                        </span>

                      ) : (

                        <button
                          type="button"
                          className="student-assignment-submit-btn"
                          onClick={() =>
                            handleSelectAssignment(
                              assignment
                            )
                          }
                        >

                          <FaUpload />

                          Submit Assignment

                        </button>

                      )}

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>


      {/* ======================================
          MY SUBMISSIONS
      ======================================= */}

      <section className="student-assignment-section">

        <div className="student-assignment-section-header">

          <div>
            <h2>
              My Submissions
            </h2>

            <p>
              Track the assignments you have
              submitted and their grading status.
            </p>
          </div>

          <span className="student-assignment-count">
            {submissions.length}
          </span>

        </div>


        {loading ? (

          <div className="student-assignment-loading">

            <FaFileAlt />

            <p>
              Loading submissions...
            </p>

          </div>

        ) : submissions.length === 0 ? (

          <div className="student-assignment-empty">

            <div className="student-assignment-empty-icon">
              <FaFileAlt />
            </div>

            <h3>
              No Submissions Yet
            </h3>

            <p>
              Submit your first assignment
              to see your submission history
              here.
            </p>

          </div>

        ) : (

          <div className="student-submission-table-wrapper">

            <table className="student-submission-table">

              <thead>
                <tr>
                  <th>
                    Course
                  </th>

                  <th>
                    Assignment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Score
                  </th>

                  <th>
                    Date Submitted
                  </th>
                </tr>
              </thead>


              <tbody>

                {submissions.map(
                  (submission) => (

                    <tr
                      key={submission._id}
                    >

                      <td>

                        <div className="student-submission-course">

                          <FaBookOpen />

                          <span>
                            {submission.course?.title ||
                              "—"}
                          </span>

                        </div>

                      </td>


                      <td>
                        <strong>
                          {submission.title ||
                            "—"}
                        </strong>
                      </td>


                      <td>

                        <span
                          className={`student-submission-status ${
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

                          {submission.status ||
                            "Pending"}

                        </span>

                      </td>


                      <td>

                        <span className="student-submission-score">
                          {submission.score ??
                            "--"}
                        </span>

                      </td>


                      <td>

                        {submission.createdAt
                          ? new Date(
                              submission.createdAt
                            ).toLocaleDateString()
                          : "—"}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ======================================
          SUBMISSION DRAWER
      ======================================= */}

      {showSubmitForm && (

        <>

          <div
            className="student-assignment-overlay"
            onClick={handleCloseForm}
          />


          <aside className="student-assignment-drawer">

            {/* DRAWER HEADER */}

            <div className="student-assignment-drawer-header">

              <div>

                <h2>
                  Submit Assignment
                </h2>

                <p>
                  Upload your completed
                  coursework below.
                </p>

              </div>


              <button
                type="button"
                className="student-assignment-close-btn"
                onClick={handleCloseForm}
              >
                <FaTimes />
              </button>

            </div>


            {/* SELECTED ASSIGNMENT */}

            {selectedAssignment && (

              <div className="student-assignment-selected">

                <div className="student-assignment-selected-icon">
                  <FaClipboardList />
                </div>

                <div>

                  <span>
                    Assignment
                  </span>

                  <strong>
                    {selectedAssignment.title}
                  </strong>

                  <small>
                    {selectedAssignment.course?.title ||
                      "Course"}
                  </small>

                </div>

              </div>

            )}


            {/* FORM */}

            <form
              className="student-assignment-form"
              onSubmit={handleSubmit}
            >

              {/* COURSE */}

              <div className="student-assignment-form-group">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  disabled={!!selectedAssignment}
                >

                  <option value="">
                    Select Course
                  </option>

                  {courses.map(
                    (course) => (

                      <option
                        key={course._id}
                        value={course._id}
                      >
                        {course.title}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* TITLE */}

              <div className="student-assignment-form-group">

                <label>
                  Assignment Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter assignment title"
                  required
                  disabled={!!selectedAssignment}
                />

              </div>


              {/* DESCRIPTION */}

              <div className="student-assignment-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your submission..."
                />

              </div>


              {/* FILE */}

              <div className="student-assignment-form-group">

                <label>
                  Upload File
                </label>

                <div className="student-assignment-file-box">

                  <FaUpload />

                  <input
                    id="student-assignment-file"
                    type="file"
                    name="file"
                    onChange={handleChange}
                    required
                  />

                </div>

                <small className="student-assignment-file-note">
                  Accepted formats: PDF, DOC,
                  DOCX, ZIP, JPG, PNG
                </small>

              </div>


              {/* ACTIONS */}

              <div className="student-assignment-form-actions">

                <button
                  type="button"
                  className="student-assignment-cancel-btn"
                  onClick={handleCloseForm}
                  disabled={submitting}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="student-assignment-save-btn"
                  disabled={submitting}
                >

                  {submitting ? (
                    <>
                      <FaClock />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Submit Assignment
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

export default StudentAssignments;