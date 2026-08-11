import {
  FaSave,
  FaTimes,
} from "react-icons/fa";

import "../../styles/InstructorAssignmentForm.css";

function InstructorAssignmentForm({
  formData,
  handleChange,
  handleSubmit,
  editingAssignment,
  courses,
  onCancel,
}) {
  return (
    <form
      className="instructor-assignment-form"
      onSubmit={handleSubmit}
    >

      {/* =====================================
          TITLE
      ====================================== */}

      <div className="instructor-assignment-form-group">

        <label htmlFor="assignment-title">
          Assignment Title
          <span>*</span>
        </label>

        <input
          id="assignment-title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter assignment title"
          required
        />

      </div>


      {/* =====================================
          COURSE
      ====================================== */}

      <div className="instructor-assignment-form-group">

        <label htmlFor="assignment-course">
          Course
          <span>*</span>
        </label>

        <select
          id="assignment-course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        >

          <option value="">
            Select course
          </option>

          {courses?.map((course) => (

            <option
              key={course._id}
              value={course._id}
            >
              {course.title}
              {course.code
                ? ` (${course.code})`
                : ""}
            </option>

          ))}

        </select>

      </div>


      {/* =====================================
          DESCRIPTION
      ====================================== */}

      <div className="instructor-assignment-form-group">

        <label htmlFor="assignment-description">
          Description
        </label>

        <textarea
          id="assignment-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the assignment..."
          rows="5"
        />

      </div>


      {/* =====================================
          DUE DATE
      ====================================== */}

      <div className="instructor-assignment-form-row">

        <div className="instructor-assignment-form-group">

          <label htmlFor="assignment-due-date">
            Due Date
            <span>*</span>
          </label>

          <input
            id="assignment-due-date"
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />

        </div>


        {/* ===================================
            TOTAL MARKS
        ==================================== */}

        <div className="instructor-assignment-form-group">

          <label htmlFor="assignment-total-marks">
            Total Marks
          </label>

          <input
            id="assignment-total-marks"
            type="number"
            name="totalMarks"
            value={formData.totalMarks}
            onChange={handleChange}
            min="1"
            placeholder="100"
          />

        </div>

      </div>


      {/* =====================================
          SUBMISSION TYPE
      ====================================== */}

      <div className="instructor-assignment-form-group">

        <label htmlFor="assignment-submission-type">
          Submission Type
        </label>

        <select
          id="assignment-submission-type"
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


      {/* =====================================
          STATUS
      ====================================== */}

      <div className="instructor-assignment-form-group">

        <label htmlFor="assignment-status">
          Status
        </label>

        <select
          id="assignment-status"
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


      {/* =====================================
          ATTACHMENT
      ====================================== */}

      <div className="instructor-assignment-form-group">

        <label htmlFor="assignment-attachment">
          Attachment URL
        </label>

        <input
          id="assignment-attachment"
          type="text"
          name="attachment"
          value={formData.attachment}
          onChange={handleChange}
          placeholder="Optional attachment URL"
        />

        <small>
          Add a document URL if the assignment
          contains supporting material.
        </small>

      </div>


      {/* =====================================
          ACTIONS
      ====================================== */}

      <div className="instructor-assignment-form-actions">

        <button
          type="button"
          className="instructor-assignment-cancel-btn"
          onClick={onCancel}
        >
          <FaTimes />
          Cancel
        </button>


        <button
          type="submit"
          className="instructor-assignment-save-btn"
        >

          <FaSave />

          {editingAssignment
            ? "Update Assignment"
            : "Create Assignment"}

        </button>

      </div>

    </form>
  );
}

export default InstructorAssignmentForm;