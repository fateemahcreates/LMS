import { useEffect, useState } from "react";

import { getCourses } from "../services/courseService";

import "../styles/AssignmentForm.css";

import {
  FaTasks,
  FaBookOpen,
  FaCalendarAlt,
  FaClipboardCheck,
  FaCloudUploadAlt,
  FaAlignLeft,
  FaPlus,
  FaEdit,
} from "react-icons/fa";

function AssignmentForm({
  formData,
  handleChange,
  handleSubmit,
  editingAssignment,
}) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className="assignment-form"
      onSubmit={handleSubmit}
    >
      {/* Header */}

      <div className="form-header">
        <h2>
          {editingAssignment
            ? "Edit Assignment"
            : "Create Assignment"}
        </h2>

        <p>
          Create assignments for students enrolled
          in your academy.
        </p>
      </div>

      {/* Title */}

      <div className="input-group">

        <label>Assignment Title</label>

        <div className="input-wrapper">

          <FaTasks className="input-icon" />

          <input
            type="text"
            name="title"
            placeholder="React Final Project"
            value={formData.title}
            onChange={handleChange}
            required
          />

        </div>

      </div>

      {/* Course */}

      <div className="input-group">

        <label>Course</label>

        <div className="input-wrapper">

          <FaBookOpen className="input-icon" />

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

      </div>

      {/* Due Date */}

      <div className="input-group">

        <label>Due Date</label>

        <div className="input-wrapper">

          <FaCalendarAlt className="input-icon" />

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />

        </div>

      </div>

      {/* Total Marks */}

      <div className="input-group">

        <label>Total Marks</label>

        <div className="input-wrapper">

          <FaClipboardCheck className="input-icon" />

          <input
            type="number"
            name="totalMarks"
            value={formData.totalMarks}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* Submission Type */}

      <div className="input-group">

        <label>Submission Type</label>

        <div className="input-wrapper">

          <select
            name="submissionType"
            value={formData.submissionType}
            onChange={handleChange}
          >
            <option value="Online">
              Online
            </option>

            <option value="Physical">
              Physical
            </option>

          </select>

        </div>

      </div>

      {/* Description */}

      <div className="input-group">

        <label>Description</label>

        <div className="input-wrapper textarea-wrapper">

          <FaAlignLeft className="input-icon" />

          <textarea
            name="description"
            rows="5"
            placeholder="Assignment instructions..."
            value={formData.description}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* Attachment */}

      <div className="input-group">

        <label>Attachment URL</label>

        <div className="input-wrapper">

          <FaCloudUploadAlt className="input-icon" />

          <input
            type="text"
            name="attachment"
            placeholder="https://..."
            value={formData.attachment}
            onChange={handleChange}
          />

        </div>

      </div>

      {/* Status */}

      <div className="input-group">

        <label>Status</label>

        <div className="input-wrapper">

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
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

      {/* Submit */}

      <button
        type="submit"
        className="submit-btn"
      >
        {editingAssignment ? (
          <>
            <FaEdit />

            <span>Update Assignment</span>
          </>
        ) : (
          <>
            <FaPlus />

            <span>Create Assignment</span>
          </>
        )}
      </button>

    </form>
  );
}

export default AssignmentForm;