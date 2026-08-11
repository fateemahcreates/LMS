import {
  FaTimes,
  FaClipboardList,
} from "react-icons/fa";

import InstructorAssignmentForm from "./InstructorAssignmentForm";

import "../../styles/InstructorAssignmentDrawer.css";

function InstructorAssignmentDrawer({
  open,
  onClose,

  formData,
  handleChange,
  handleSubmit,

  editingAssignment,

  courses,

}) {
  return (
    <>

      {/* =====================================
          BACKDROP
      ====================================== */}

      {open && (
        <div
          className="instructor-assignment-drawer-backdrop"
          onClick={onClose}
        />
      )}


      {/* =====================================
          DRAWER
      ====================================== */}

      <aside
        className={`instructor-assignment-drawer ${
          open ? "open" : ""
        }`}
      >

        {/* ===================================
            HEADER
        ==================================== */}

        <header className="instructor-assignment-drawer-header">

          <div className="instructor-assignment-drawer-heading">

            <div className="instructor-assignment-drawer-icon">
              <FaClipboardList />
            </div>

            <div>

              <h2>
                {editingAssignment
                  ? "Edit Assignment"
                  : "Create Assignment"}
              </h2>

              <p>
                {editingAssignment
                  ? "Update the assignment details below."
                  : "Create an assignment for one of your assigned courses."}
              </p>

            </div>

          </div>


          <button
            type="button"
            className="instructor-assignment-drawer-close"
            onClick={onClose}
            aria-label="Close assignment drawer"
          >
            <FaTimes />
          </button>

        </header>


        {/* ===================================
            BODY
        ==================================== */}

        <div className="instructor-assignment-drawer-body">

          <InstructorAssignmentForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingAssignment={
              editingAssignment
            }
            courses={courses}
            onCancel={onClose}
          />

        </div>

      </aside>

    </>
  );
}

export default InstructorAssignmentDrawer;