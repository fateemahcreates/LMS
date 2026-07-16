import { useEffect, useState } from "react";

import {
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import { getCourses } from "../../services/courseService";
import {
  submitAssignment,
  getMySubmissions,
  getAcademyAssignments, } from "../../services/SubmissionService"; 

import "../../styles/StudentAssignments.css";

function Assignments() {
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [academyAssignments, setAcademyAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    course: "",
    title: "",
    description: "",
    file: null,
  });

  // =====================================
  // Load Courses
  // =====================================

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================
  // Load My Submissions
  // =====================================

  const loadSubmissions = async () => {
    try {
      const res = await getMySubmissions();
      setSubmissions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadSubmissions();
  }, []);

  

  // =====================================
  // Handle Input
  // =====================================

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });

      return;
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // Submit Assignment
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course || !formData.title || !formData.file) {
      return alert("Please complete all required fields.");
    }

    try {
      const data = new FormData();

      data.append("course", formData.course);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("file", formData.file);

      await submitAssignment(data);

      alert("Assignment submitted successfully!");

      setFormData({
        course: "",
        title: "",
        description: "",
        file: null,
      });

      document.getElementById("assignment-file").value = "";

      loadSubmissions();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to submit assignment."
      );
    }
  };

  return (
    <main className="student-assignments">

      {/* =======================================
          PAGE HEADER
      ======================================== */}

      <div className="page-header">
        <h1>Assignments</h1>

        <p>
          Submit your coursework and monitor your
          grading progress.
        </p>
      </div>

      {/* =======================================
          SUBMISSION FORM
      ======================================== */}

      <div className="assignment-card">

        <h2>
          <FaUpload />
          Submit Assignment
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Course *</label>

            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.title}
                </option>
              ))}

            </select>

          </div>

          <div className="form-group">

            <label>Assignment Title *</label>

            <input
              type="text"
              name="title"
              placeholder="Enter assignment title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              rows="5"
              name="description"
              placeholder="Describe your work..."
              value={formData.description}
              onChange={handleChange}
            />

          </div>

          <div className="form-group">

            <label>Upload File *</label>

            <input
              id="assignment-file"
              type="file"
              name="file"
              onChange={handleChange}
              required
            />

            <small>
              Accepted:
              PDF, DOC, DOCX, ZIP, JPG, PNG
            </small>

          </div>

          <button
            className="submit-btn"
            type="submit"
          >
            <FaUpload />
            Submit Assignment
          </button>

        </form>

      </div>

      {/* =======================================
          MY SUBMISSIONS
      ======================================== */}

      <div className="assignment-card">

        <h2>
          <FaFileAlt />
          My Submissions
        </h2>

        {loading ? (

          <p>Loading...</p>

        ) : submissions.length === 0 ? (

          <div className="empty-state">

            <FaFileAlt className="empty-icon" />

            <h3>No Submissions Yet</h3>

            <p>
              Upload your first assignment to see it
              here.
            </p>

          </div>

        ) : (

          <div className="submission-table">

            <table>

              <thead>

                <tr>
                  <th>Course</th>
                  <th>Assignment</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>

              </thead>

              <tbody>

                {submissions.map((submission) => (

                  <tr key={submission._id}>

                    <td>
                      {submission.course?.title}
                    </td>

                    <td>
                      {submission.title}
                    </td>

                    <td>

                      <span
                        className={`status ${submission.status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >

                        {submission.status ===
                        "Graded" ? (
                          <FaCheckCircle />
                        ) : (
                          <FaClock />
                        )}

                        {submission.status}

                      </span>

                    </td>

                    <td>

                      {submission.score ??
                        "--"}

                    </td>

                    <td>

                      {new Date(
                        submission.createdAt
                      ).toLocaleDateString()}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}

export default Assignments;