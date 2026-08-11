import { FaTimes, FaUserEdit } from "react-icons/fa";
import StudentForm from "../components/StudentsForm";

import "../styles/StudentEditDrawer.css";

function StudentEditDrawer({
  open,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  editingStudent,
}) {
  return (
    <div
      className={`gmt-student-edit-drawer ${
        open ? "open" : ""
      }`}
    >
      {/* ==========================
          HEADER
      ========================== */}

      <div className="gmt-student-edit-header">

        <div>

          <h2>

            <FaUserEdit />

            Edit Student

          </h2>

          <p>
            Update student information and
            academic details.
          </p>

        </div>

        <button
          className="gmt-student-edit-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

      </div>

      {/* ==========================
          BODY
      ========================== */}

      <div className="gmt-student-edit-body">

        <StudentForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingStudent={editingStudent}
        />

      </div>

    </div>
  );
}

export default StudentEditDrawer;