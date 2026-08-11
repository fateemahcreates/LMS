import "../styles/StudentForm.css";

import {
  FaIdCard,
  FaBookOpen,
  FaPhone,
  FaEdit,
} from "react-icons/fa";

function StudentForm({
  formData,
  handleChange,
  handleSubmit,
  editingStudent,
}) {
  return (
    <form
      className="student-form"
      onSubmit={handleSubmit}
    >
      {/* ==========================
          Student ID
      ========================== */}

      <div className="input-group">
        <label>Student ID</label>

        <div className="input-wrapper">
          <FaIdCard className="input-icon" />

          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="GMT2026001"
            required
          />
        </div>
      </div>

      {/* ==========================
          Program
      ========================== */}

      <div className="input-group">
        <label>Training Program</label>

        <div className="input-wrapper">
          <FaBookOpen className="input-icon" />

          <input
            type="text"
            name="program"
            value={formData.program}
            onChange={handleChange}
            placeholder="Frontend Development"
            required
          />
        </div>
      </div>

      {/* ==========================
          Phone
      ========================== */}

      <div className="input-group">
        <label>Phone Number</label>

        <div className="input-wrapper">
          <FaPhone className="input-icon" />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234..."
          />
        </div>
      </div>

      {/* ==========================
          Submit
      ========================== */}

      <button
        type="submit"
        className="submit-btn"
        disabled={!editingStudent}
      >
        <FaEdit />

        <span>
          Save Changes
        </span>
      </button>
    </form>
  );
}

export default StudentForm;