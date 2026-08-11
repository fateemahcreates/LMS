import {
  FaTimes,
  FaBookOpen,
} from "react-icons/fa";

import CourseForm from "./CourseForm";

import "../styles/AdminCourseDrawer.css";

function AdminCourseDrawer({
  open,
  onClose,
  formData,
  handleChange,
  handleSubmit,
  editingCourse,
  instructors,
}) {
  return (
    <>

      {/* Backdrop */}

      {open && (
        <div
          className="admin-course-backdrop"
          onClick={onClose}
        />
      )}

      {/* Drawer */}

      <aside
        className={`admin-course-drawer ${
          open ? "open" : ""
        }`}
      >

        {/* Header */}

        <div className="admin-course-header">

          <div className="admin-course-profile">

            <div className="admin-course-avatar">

              <FaBookOpen />

            </div>

            <div>

              <h2>

                {editingCourse
                  ? "Edit Programme"
                  : "Create Programme"}

              </h2>

              <p>
                Configure GMT Academy
                programme information,
                instructor assignment and
                learning details.
              </p>

            </div>

          </div>

          <button
            className="admin-course-close"
            onClick={onClose}
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}

        <div className="admin-course-body">

          <CourseForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingCourse={editingCourse}
            instructors={instructors}
          />

        </div>

      </aside>

    </>
  );
}

export default AdminCourseDrawer;