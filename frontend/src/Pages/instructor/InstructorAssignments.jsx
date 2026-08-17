import { useEffect, useState } from "react";
import { notify } from "../../utils/notify";

import {
  FaClipboardList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaClock,
  FaBookOpen,
  FaTimes,
  FaSave,
  FaEye,
  FaCheckCircle,
  FaFileAlt,
  FaGraduationCap,
  FaDownload,
} from "react-icons/fa";

import {
  getInstructorAssignments,
  createInstructorAssignment,
  updateInstructorAssignment,
  deleteInstructorAssignment,
} from "../../services/assignmentService";

import {
  getInstructorCourses,
} from "../../services/instructorService";

import {
  getInstructorSubmissions,
  gradeInstructorSubmission,
} from "../../services/SubmissionService";

import "../../styles/InstructorAssignments.css";

function InstructorAssignments() {
  // ==========================================
  // ASSIGNMENTS
  // ==========================================

  const [assignments, setAssignments] = useState([]);

  // ==========================================
  // COURSES
  // ==========================================

  const [courses, setCourses] = useState([]);

  // ==========================================
  // SUBMISSIONS
  // ==========================================

  const [submissions, setSubmissions] = useState([]);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [submissionsLoading, setSubmissionsLoading] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [grading, setGrading] = useState(false);

  // ==========================================
  // ASSIGNMENT FORM
  // ==========================================

  const [showForm, setShowForm] = useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState(null);

  // ==========================================
  // SUBMISSION DRAWER
  // ==========================================

  const [showSubmissionDrawer, setShowSubmissionDrawer] =
    useState(false);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  // ==========================================
  // SELECTED SUBMISSION
  // ==========================================

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  // ==========================================
  // GRADING FORM
  // ==========================================

  const [gradeData, setGradeData] = useState({
    score: "",
    feedback: "",
  });

  // ==========================================
  // ASSIGNMENT FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    dueDate: "",
    totalMarks: 100,
    submissionType: "Online",
    attachment: "",
    status: "Active",
  });

  // ==========================================
  // BACKEND URL
  // ==========================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  // Remove /api because static uploads
  // are usually served from /uploads
  const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

  // ==========================================
  // BUILD SUBMISSION FILE URL
  // ==========================================

  const getSubmissionFileUrl = (file) => {
    if (!file) {
      return null;
    }

    // If backend already returns a complete URL
    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    // Remove accidental leading slashes
    const cleanFile = file.replace(/^\/+/, "");

    // If backend already returns uploads/...
    if (cleanFile.startsWith("uploads/")) {
      return `${SERVER_URL}/${cleanFile}`;
    }

    // Normal student assignment upload
    return `${SERVER_URL}/uploads/assignments/${cleanFile}`;
  };

  // ==========================================
  // DOWNLOAD SUBMISSION
  // ==========================================

  const handleDownloadSubmission = (submission) => {
    const fileUrl = getSubmissionFileUrl(
      submission?.file
    );

    if (!fileUrl) {
      alert("No submission file is available.");
      return;
    }

    // Create a temporary link
    const link = document.createElement("a");

    link.href = fileUrl;

    link.setAttribute("download", "");

    link.setAttribute("target", "_blank");

    link.setAttribute(
      "rel",
      "noopener noreferrer"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadAssignments();
    loadCourses();
    loadSubmissions();
  }, []);

  // ==========================================
  // LOAD ASSIGNMENTS
  // ==========================================

  const loadAssignments = async () => {
    try {
      setLoading(true);

      const res =
        await getInstructorAssignments();

      console.log(
        "========== INSTRUCTOR ASSIGNMENTS =========="
      );

      console.log(res.data);

      setAssignments(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load instructor assignments:",
        error
      );

      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD COURSES
  // ==========================================

  const loadCourses = async () => {
    try {
      const res =
        await getInstructorCourses();

      console.log(
        "========== INSTRUCTOR COURSES =========="
      );

      console.log(res.data);

      setCourses(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Unable to load instructor courses:",
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
      setSubmissionsLoading(true);

      const res =
        await getInstructorSubmissions();

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
      setSubmissionsLoading(false);
    }
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        name === "totalMarks"
          ? Number(value)
          : value,
    }));
  };

  // ==========================================
  // CREATE
  // ==========================================

  const handleCreate = () => {
    setEditingAssignment(null);

    setFormData({
      title: "",
      description: "",
      course: "",
      dueDate: "",
      totalMarks: 100,
      submissionType: "Online",
      attachment: "",
      status: "Active",
    });

    setShowForm(true);
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);

    setFormData({
      title:
        assignment.title || "",

      description:
        assignment.description || "",

      course:
        assignment.course?._id ||
        assignment.course ||
        "",

      dueDate:
        assignment.dueDate
          ? new Date(
              assignment.dueDate
            )
              .toISOString()
              .split("T")[0]
          : "",

      totalMarks:
        assignment.totalMarks || 100,

      submissionType:
        assignment.submissionType ||
        "Online",

      attachment:
        assignment.attachment || "",

      status:
        assignment.status ||
        "Active",
    });

    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCloseForm = () => {
    if (saving) return;

    setShowForm(false);

    setEditingAssignment(null);
  };

  // ==========================================
  // SAVE ASSIGNMENT
  // ==========================================
const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.title.trim() ||
    !formData.course ||
    !formData.dueDate
  ) {
    notify.warning(
      "Assignment title, course and due date are required."
    );

    return;
  }

  try {
    setSaving(true);

    if (editingAssignment) {
      await updateInstructorAssignment(
        editingAssignment._id,
        formData
      );

      notify.success(
        "Assignment updated successfully."
      );
    } else {
      await createInstructorAssignment(
        formData
      );

      notify.success(
        "Assignment created successfully."
      );
    }

    setShowForm(false);

    setEditingAssignment(null);

    setFormData({
      title: "",
      description: "",
      course: "",
      dueDate: "",
      totalMarks: 100,
      submissionType: "Online",
      attachment: "",
      status: "Active",
    });

    await loadAssignments();

  } catch (error) {

    console.error(
      "SAVE INSTRUCTOR ASSIGNMENT ERROR:",
      error
    );

    notify.apiError(error);

  } finally {
    setSaving(false);
  }
};

  // ==========================================
  // DELETE
  // ==========================================

 const handleDelete = (id) => {

  notify.confirmDelete(async () => {

    try {

      await deleteInstructorAssignment(id);

      notify.success(
        "Assignment deleted successfully."
      );

      await loadAssignments();

    } catch (error) {

      console.error(
        "DELETE INSTRUCTOR ASSIGNMENT ERROR:",
        error
      );

      notify.apiError(error);

    }

  });

};

  // ==========================================
  // GET ASSIGNMENT SUBMISSIONS
  // ==========================================

  const getAssignmentSubmissions = (
    assignmentId
  ) => {
    return submissions.filter(
      (submission) => {
        const submissionAssignmentId =
          submission.assignment?._id ||
          submission.assignment;

        return (
          submissionAssignmentId
            ?.toString() ===
          assignmentId?.toString()
        );
      }
    );
  };

  // ==========================================
  // SUBMISSION COUNT
  // ==========================================

  const getSubmissionCount = (
    assignmentId
  ) => {
    return getAssignmentSubmissions(
      assignmentId
    ).length;
  };

  // ==========================================
  // OPEN SUBMISSIONS
  // ==========================================

  const handleViewSubmissions = (
    assignment
  ) => {
    setSelectedAssignment(
      assignment
    );

    setSelectedSubmission(null);

    setGradeData({
      score: "",
      feedback: "",
    });

    setShowSubmissionDrawer(true);

    loadSubmissions();
  };

  // ==========================================
  // CLOSE SUBMISSION DRAWER
  // ==========================================

  const handleCloseSubmissionDrawer = () => {
    if (grading) return;

    setShowSubmissionDrawer(false);

    setSelectedAssignment(null);

    setSelectedSubmission(null);

    setGradeData({
      score: "",
      feedback: "",
    });
  };

  // ==========================================
  // SELECT SUBMISSION
  // ==========================================

  const handleSelectSubmission = (
    submission
  ) => {
    setSelectedSubmission(
      submission
    );

    setGradeData({
      score:
        submission.score !==
          undefined &&
        submission.score !== null
          ? submission.score
          : "",

      feedback:
        submission.feedback ||
        "",
    });
  };

  // ==========================================
  // GRADE CHANGE
  // ==========================================

  const handleGradeChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setGradeData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // ==========================================
  // GRADE SUBMISSION
  // ==========================================

  const handleGradeSubmission =
    async (e) => {
      e.preventDefault();

      if (!selectedSubmission) {
        return;
      }

      if (
        gradeData.score === "" ||
        gradeData.score === null
      ) {
       notify.warning(
  "Please enter a score."
);
        return;
      }

      const maxMarks =
        selectedSubmission
          .assignment
          ?.totalMarks ||
        selectedAssignment
          ?.totalMarks ||
        100;

      const numericScore =
        Number(
          gradeData.score
        );

      if (
        numericScore < 0 ||
        numericScore >
          Number(maxMarks)
      ) {
        notify.warning(
  `Score must be between 0 and ${maxMarks}.`
);

        return;
      }

      try {
        setGrading(true);

        await gradeInstructorSubmission(
          selectedSubmission._id,
          {
            score:
              numericScore,

            feedback:
              gradeData.feedback ||
              "",
          }
        );
notify.success(
  "Submission graded successfully."
);

        await loadSubmissions();

        setSelectedSubmission(
          (previous) =>
            previous
              ? {
                  ...previous,

                  score:
                    numericScore,

                  feedback:
                    gradeData.feedback ||
                    "",

                  status:
                    "Graded",
                }
              : previous
        );
      } catch (error) {
        console.error(
          "GRADE SUBMISSION ERROR:",
          error
        );
notify.apiError(error);
      } finally {
        setGrading(false);
      }
    };

  // ==========================================
  // FILTER ASSIGNMENTS
  // ==========================================

  const instructorCourseIds =
    courses.map(
      (course) =>
        course._id?.toString()
    );

  const instructorAssignments =
    assignments.filter(
      (assignment) => {
        const assignmentCourseId =
          assignment.course?._id ||
          assignment.course;

        return instructorCourseIds.includes(
          assignmentCourseId?.toString()
        );
      }
    );

  // ==========================================
  // STATISTICS
  // ==========================================

  const activeAssignments =
    instructorAssignments.filter(
      (assignment) =>
        assignment.status ===
        "Active"
    ).length;

  const closedAssignments =
    instructorAssignments.filter(
      (assignment) =>
        assignment.status ===
        "Closed"
    ).length;

  const totalSubmissions =
    submissions.length;

  // ==========================================
  // SELECTED ASSIGNMENT SUBMISSIONS
  // ==========================================

  const selectedAssignmentSubmissions =
    selectedAssignment
      ? getAssignmentSubmissions(
          selectedAssignment._id
        )
      : [];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="instructor-assignments-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <section className="instructor-assignment-header">

        <div className="instructor-assignment-header-left">

          <div className="instructor-assignment-heading-icon">
            <FaClipboardList />
          </div>

          <div>
            <h1>
              Assignments
            </h1>

            <p>
              Create, manage and monitor
              assignments for your courses.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="instructor-assignment-create-btn"
          onClick={
            handleCreate
          }
        >
          <FaPlus />

          Create Assignment
        </button>

      </section>

      {/* =====================================
          STATISTICS
      ====================================== */}

      <section className="instructor-assignment-stats">

        <div className="instructor-assignment-stat-card">

          <div className="instructor-assignment-stat-icon">
            <FaClipboardList />
          </div>

          <div>
            <span>
              Total Assignments
            </span>

            <strong>
              {
                instructorAssignments.length
              }
            </strong>
          </div>

        </div>

        <div className="instructor-assignment-stat-card">

          <div className="instructor-assignment-stat-icon">
            <FaClock />
          </div>

          <div>
            <span>
              Active
            </span>

            <strong>
              {activeAssignments}
            </strong>
          </div>

        </div>

        <div className="instructor-assignment-stat-card">

          <div className="instructor-assignment-stat-icon">
            <FaBookOpen />
          </div>

          <div>
            <span>
              Closed
            </span>

            <strong>
              {closedAssignments}
            </strong>
          </div>

        </div>

        <div className="instructor-assignment-stat-card">

          <div className="instructor-assignment-stat-icon">
            <FaFileAlt />
          </div>

          <div>
            <span>
              Submissions
            </span>

            <strong>
              {totalSubmissions}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================
          ASSIGNMENTS
      ====================================== */}

      <section className="instructor-assignment-section">

        <div className="instructor-assignment-section-header">

          <div>
            <h2>
              Course Assignments
            </h2>

            <p>
              Assignments belonging to
              your assigned courses.
            </p>
          </div>

          <span className="instructor-assignment-count">
            {
              instructorAssignments.length
            }
          </span>

        </div>

        {loading ? (

          <div className="instructor-assignment-loading">

            <FaClipboardList />

            <p>
              Loading assignments...
            </p>

          </div>

        ) : instructorAssignments.length ===
          0 ? (

          <div className="instructor-assignment-empty">

            <div className="instructor-assignment-empty-icon">
              <FaClipboardList />
            </div>

            <h3>
              No Assignments Yet
            </h3>

            <p>
              Create your first
              assignment for one
              of your courses.
            </p>

            <button
              type="button"
              onClick={
                handleCreate
              }
              className="instructor-assignment-empty-btn"
            >
              <FaPlus />

              Create Assignment
            </button>

          </div>

        ) : (

          <div className="instructor-assignment-grid">

            {instructorAssignments.map(
              (assignment) => {

                const submissionCount =
                  getSubmissionCount(
                    assignment._id
                  );

                return (
                  <article
                    key={
                      assignment._id
                    }
                    className="instructor-assignment-card"
                  >

                    <div className="instructor-assignment-card-top">

                      <div className="instructor-assignment-card-icon">
                        <FaClipboardList />
                      </div>

                      <span
                        className={`instructor-assignment-status ${
                          assignment.status
                            ?.toLowerCase()
                        }`}
                      >
                        {
                          assignment.status
                        }
                      </span>

                    </div>

                    <h3>
                      {
                        assignment.title
                      }
                    </h3>

                    <p className="instructor-assignment-description">
                      {
                        assignment.description ||
                        "No description provided."
                      }
                    </p>

                    <div className="instructor-assignment-details">

                      <div>
                        <FaBookOpen />

                        <span>
                          {
                            assignment
                              .course
                              ?.title ||
                            "Course"
                          }
                        </span>
                      </div>

                      <div>
                        <FaClock />

                        <span>
                          Due:{" "}
                          {assignment.dueDate
                            ? new Date(
                                assignment.dueDate
                              ).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>

                      <div>
                        <FaClipboardList />

                        <span>
                          {
                            assignment.totalMarks ||
                            100
                          }{" "}
                          Marks
                        </span>
                      </div>

                    </div>

                    <div className="instructor-assignment-submission-summary">

                      <div className="instructor-assignment-submission-icon">
                        <FaFileAlt />
                      </div>

                      <div>

                        <strong>
                          {
                            submissionCount
                          }
                        </strong>

                        <span>
                          {
                            submissionCount ===
                            1
                              ? "Student Submission"
                              : "Student Submissions"
                          }
                        </span>

                      </div>

                    </div>

                    <div className="instructor-assignment-card-footer">

                      <span>
                        {
                          assignment.submissionType ||
                          "Online"
                        }
                      </span>

                      <div className="instructor-assignment-actions">

                        <button
                          type="button"
                          className="instructor-assignment-view-btn"
                          onClick={() =>
                            handleViewSubmissions(
                              assignment
                            )
                          }
                          title="View student submissions"
                        >
                          <FaEye />

                          <span>
                            Submissions
                          </span>

                          {submissionCount >
                            0 && (
                            <b>
                              {
                                submissionCount
                              }
                            </b>
                          )}
                        </button>

                        <button
                          type="button"
                          className="instructor-assignment-edit-btn"
                          onClick={() =>
                            handleEdit(
                              assignment
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          className="instructor-assignment-delete-btn"
                          onClick={() =>
                            handleDelete(
                              assignment._id
                            )
                          }
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

      {/* =====================================
          CREATE / EDIT DRAWER
      ====================================== */}

      {showForm && (
        <>

          <div
            className="instructor-assignment-overlay"
            onClick={
              handleCloseForm
            }
          />

          <aside className="instructor-assignment-drawer">

            <div className="instructor-assignment-drawer-header">

              <div>

                <h2>
                  {
                    editingAssignment
                      ? "Edit Assignment"
                      : "Create Assignment"
                  }
                </h2>

                <p>
                  Configure the
                  assignment details
                  below.
                </p>

              </div>

              <button
                type="button"
                className="instructor-assignment-close-btn"
                onClick={
                  handleCloseForm
                }
              >
                <FaTimes />
              </button>

            </div>

            <form
              className="instructor-assignment-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="instructor-assignment-form-group">

                <label>
                  Assignment Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="e.g. React Components Project"
                  required
                />

              </div>

              <div className="instructor-assignment-form-group">

                <label>
                  Course
                </label>

                <select
                  name="course"
                  value={
                    formData.course
                  }
                  onChange={
                    handleFormChange
                  }
                  required
                >

                  <option value="">
                    Select Course
                  </option>

                  {courses.map(
                    (course) => (
                      <option
                        key={
                          course._id
                        }
                        value={
                          course._id
                        }
                      >
                        {
                          course.title
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="instructor-assignment-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="5"
                  value={
                    formData.description
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="Describe the assignment..."
                />

              </div>

              <div className="instructor-assignment-form-row">

                <div className="instructor-assignment-form-group">

                  <label>
                    Due Date
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      formData.dueDate
                    }
                    onChange={
                      handleFormChange
                    }
                    required
                  />

                </div>

                <div className="instructor-assignment-form-group">

                  <label>
                    Total Marks
                  </label>

                  <input
                    type="number"
                    name="totalMarks"
                    min="1"
                    value={
                      formData.totalMarks
                    }
                    onChange={
                      handleFormChange
                    }
                  />

                </div>

              </div>

              <div className="instructor-assignment-form-row">

                <div className="instructor-assignment-form-group">

                  <label>
                    Submission Type
                  </label>

                  <select
                    name="submissionType"
                    value={
                      formData.submissionType
                    }
                    onChange={
                      handleFormChange
                    }
                  >
                    <option value="Online">
                      Online
                    </option>

                    <option value="Physical">
                      Physical
                    </option>
                  </select>

                </div>

                <div className="instructor-assignment-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleFormChange
                    }
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>

                </div>

              </div>

              <div className="instructor-assignment-form-group">

                <label>
                  Attachment URL
                </label>

                <input
                  type="text"
                  name="attachment"
                  value={
                    formData.attachment
                  }
                  onChange={
                    handleFormChange
                  }
                  placeholder="https://..."
                />

              </div>

              <div className="instructor-assignment-form-actions">

                <button
                  type="button"
                  className="instructor-assignment-cancel-btn"
                  onClick={
                    handleCloseForm
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="instructor-assignment-save-btn"
                  disabled={saving}
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : editingAssignment
                    ? "Update Assignment"
                    : "Create Assignment"}
                </button>

              </div>

            </form>

          </aside>

        </>
      )}

      {/* =====================================
          STUDENT SUBMISSIONS DRAWER
      ====================================== */}

      {showSubmissionDrawer && (
        <>

          <div
            className="instructor-submission-overlay"
            onClick={
              handleCloseSubmissionDrawer
            }
          />

          <aside className="instructor-submission-drawer">

            {/* HEADER */}

            <div className="instructor-submission-drawer-header">

              <div className="instructor-submission-header-left">

                <div className="instructor-submission-header-icon">
                  <FaFileAlt />
                </div>

                <div>
                  <h2>
                    Student Submissions
                  </h2>

                  <p>
                    {
                      selectedAssignment?.title
                    }
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="instructor-submission-close-btn"
                onClick={
                  handleCloseSubmissionDrawer
                }
              >
                <FaTimes />
              </button>

            </div>

            {/* ASSIGNMENT SUMMARY */}

            <div className="instructor-submission-assignment-summary">

              <div>
                <span>
                  Course
                </span>

                <strong>
                  {
                    selectedAssignment
                      ?.course
                      ?.title ||
                    "Course"
                  }
                </strong>
              </div>

              <div>
                <span>
                  Total Marks
                </span>

                <strong>
                  {
                    selectedAssignment
                      ?.totalMarks ||
                    100
                  }
                </strong>
              </div>

              <div>
                <span>
                  Submissions
                </span>

                <strong>
                  {
                    selectedAssignmentSubmissions.length
                  }
                </strong>
              </div>

            </div>

            {/* CONTENT */}

            <div className="instructor-submission-drawer-content">

              {submissionsLoading ? (

                <div className="instructor-submission-loading">

                  <FaFileAlt />

                  <p>
                    Loading student
                    submissions...
                  </p>

                </div>

              ) : selectedAssignmentSubmissions.length ===
                0 ? (

                <div className="instructor-submission-empty">

                  <div>
                    <FaFileAlt />
                  </div>

                  <h3>
                    No Submissions Yet
                  </h3>

                  <p>
                    No student has
                    submitted this
                    assignment yet.
                  </p>

                </div>

              ) : (

                <div className="instructor-submission-list">

                  {selectedAssignmentSubmissions.map(
                    (submission) => {

                      const isSelected =
                        selectedSubmission?._id ===
                        submission._id;

                      return (
                        <div
                          key={
                            submission._id
                          }
                          className={`instructor-submission-item ${
                            isSelected
                              ? "selected"
                              : ""
                          }`}
                        >

                          {/* STUDENT */}

                          <div className="instructor-submission-student">

                            <div className="instructor-submission-student-avatar">

                              {
                                submission
                                  .student
                                  ?.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                "S"
                              }

                            </div>

                            <div>

                              <strong>
                                {
                                  submission
                                    .student
                                    ?.name ||
                                  "Student"
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

                          {/* DETAILS */}

                          <div className="instructor-submission-item-details">

                            <div>
                              <span>
                                Submitted
                              </span>

                              <strong>
                                {
                                  submission.createdAt
                                    ? new Date(
                                        submission.createdAt
                                      ).toLocaleDateString()
                                    : "—"
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                Status
                              </span>

                              <strong
                                className={
                                  submission.status ===
                                  "Graded"
                                    ? "graded"
                                    : "pending"
                                }
                              >
                                {
                                  submission.status ||
                                  "Pending"
                                }
                              </strong>
                            </div>

                            <div>
                              <span>
                                Score
                              </span>

                              <strong>
                                {
                                  submission.score ??
                                  "--"
                                }

                                {" / "}

                                {
                                  submission
                                    .assignment
                                    ?.totalMarks ||
                                  selectedAssignment
                                    ?.totalMarks ||
                                  100
                                }
                              </strong>
                            </div>

                          </div>

                          {/* FILE DOWNLOAD */}

                          {submission.file && (
                            <div className="instructor-submission-file-actions">

                              <a
                                href={getSubmissionFileUrl(
                                  submission.file
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="instructor-submission-view-file-btn"
                              >
                                <FaEye />

                                View
                              </a>

                              <button
                                type="button"
                                className="instructor-submission-download-btn"
                                onClick={() =>
                                  handleDownloadSubmission(
                                    submission
                                  )
                                }
                              >
                                <FaDownload />

                                Download
                              </button>

                            </div>
                          )}

                          {/* GRADE */}

                          <div className="instructor-submission-item-action">

                            <button
                              type="button"
                              className="instructor-submission-grade-btn"
                              onClick={() =>
                                handleSelectSubmission(
                                  submission
                                )
                              }
                            >
                              {submission.status ===
                              "Graded" ? (
                                <>
                                  <FaEdit />

                                  Edit Grade
                                </>
                              ) : (
                                <>
                                  <FaGraduationCap />

                                  Grade
                                </>
                              )}
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

              {/* ==================================
                  GRADING PANEL
              =================================== */}

              {selectedSubmission && (

                <div className="instructor-submission-grade-panel">

                  <div className="instructor-submission-grade-header">

                    <div>

                      <h3>
                        Grade Submission
                      </h3>

                      <p>
                        {
                          selectedSubmission
                            .student
                            ?.name ||
                          "Student"
                        }
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSubmission(
                          null
                        )
                      }
                    >
                      <FaTimes />
                    </button>

                  </div>

                  <form
                    onSubmit={
                      handleGradeSubmission
                    }
                  >

                    <div className="instructor-submission-grade-field">

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
                            selectedAssignment
                              ?.totalMarks ||
                            100
                          }
                          value={
                            gradeData.score
                          }
                          onChange={
                            handleGradeChange
                          }
                          placeholder="Enter score"
                          required
                        />

                        <span>
                          /
                          {" "}
                          {
                            selectedSubmission
                              .assignment
                              ?.totalMarks ||
                            selectedAssignment
                              ?.totalMarks ||
                            100
                          }
                        </span>

                      </div>

                    </div>

                    <div className="instructor-submission-grade-field">

                      <label>
                        Feedback
                      </label>

                      <textarea
                        name="feedback"
                        rows="4"
                        value={
                          gradeData.feedback
                        }
                        onChange={
                          handleGradeChange
                        }
                        placeholder="Write feedback for the student..."
                      />

                    </div>

                    {/* FILE */}

                    {selectedSubmission.file && (
                      <div className="instructor-submission-file">

                        <div className="instructor-submission-file-icon">
                          <FaFileAlt />
                        </div>

                        <div className="instructor-submission-file-info">

                          <span>
                            Student Submission
                          </span>

                          <strong>
                            {
                              selectedSubmission.file
                            }
                          </strong>

                        </div>

                        <div className="instructor-submission-file-buttons">

                          <a
                            href={getSubmissionFileUrl(
                              selectedSubmission.file
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="instructor-submission-view-file-btn"
                          >
                            <FaEye />

                            View
                          </a>

                          <button
                            type="button"
                            className="instructor-submission-download-btn"
                            onClick={() =>
                              handleDownloadSubmission(
                                selectedSubmission
                              )
                            }
                          >
                            <FaDownload />

                            Download
                          </button>

                        </div>

                      </div>
                    )}

                    {/* SAVE */}

                    <button
                      type="submit"
                      className="instructor-submission-save-grade-btn"
                      disabled={
                        grading
                      }
                    >

                      {grading ? (
                        <>
                          <FaClock />

                          Saving Grade...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />

                          Save Grade
                        </>
                      )}

                    </button>

                  </form>

                </div>

              )}

            </div>

          </aside>

        </>
      )}

    </main>
  );
}

export default InstructorAssignments;