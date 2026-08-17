import {
  FaTrash,
  FaEdit,
  FaPhone,
  FaBookOpen,
  FaBan,
  FaCheckCircle,
} from "react-icons/fa";

import {
  deleteUser,
  changeUserStatus,
} from "../services/userService";

import { notify } from "../utils/notify";

import "../styles/UserTable.css";

function UserTable({
  users,
  refreshUsers,
  handleEdit,
}) {

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDelete = (id) => {
    notify.confirmDelete(async () => {
      try {
        await deleteUser(id);

        notify.success(
          "User deleted successfully."
        );

        await refreshUsers();

      } catch (error) {
        console.error(
          "Delete user error:",
          error
        );

        notify.apiError(error);
      }
    });
  };


  // ==========================================
  // SUSPEND / UNSUSPEND USER
  // ==========================================

  const handleStatusChange = (user) => {

    const isSuspended =
      user.status === "suspended";

    const newStatus =
      isSuspended
        ? "active"
        : "suspended";


    // ========================================
    // CONFIRM ACTION
    // ========================================

    const actionText =
      isSuspended
        ? "reactivate"
        : "suspend";


    const confirmed = window.confirm(
      isSuspended
        ? `Are you sure you want to reactivate ${user.name}?`
        : `Are you sure you want to suspend ${user.name}?`
    );


    if (!confirmed) {
      return;
    }


    // ========================================
    // UPDATE STATUS
    // ========================================

    const updateStatus = async () => {

      try {

        await changeUserStatus(
          user._id,
          newStatus
        );


        notify.success(
          isSuspended
            ? "User reactivated successfully."
            : "User suspended successfully."
        );


        await refreshUsers();

      } catch (error) {

        console.error(
          `Failed to ${actionText} user:`,
          error
        );

        notify.apiError(error);
      }
    };


    updateStatus();
  };


  return (
    <div className="user-table-wrapper">

      <div className="user-table-container">

        <table className="user-table">

          <thead>

            <tr>

              <th>User</th>

              <th>Student ID</th>

              <th>Contact</th>

              <th>Course / Program</th>

              <th>Role</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {users.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="empty-row"
                >
                  No users found.
                </td>

              </tr>

            ) : (

              users.map((user) => (

                <tr key={user._id}>


                  {/* =================================
                      USER
                  ================================= */}

                  <td>

                    <div className="user-cell">

                      <div className="user-avatar">

                        {user.name
                          ? user.name
                              .charAt(0)
                              .toUpperCase()
                          : "U"}

                      </div>


                      <div className="user-info">

                        <h4>
                          {user.name}
                        </h4>

                        <span>
                          {user.email}
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* =================================
                      STUDENT ID
                  ================================= */}

                  <td>

                    {user.role === "student" ? (

                      <span className="student-id">

                        {user.studentId ||
                          "Not assigned"}

                      </span>

                    ) : (

                      <span className="not-applicable">
                        —
                      </span>

                    )}

                  </td>


                  {/* =================================
                      CONTACT
                  ================================= */}

                  <td>

                    <div className="user-contact">

                      <div className="contact-item">

                        <FaPhone />

                        <span>
                          {user.phone ||
                            "No phone"}
                        </span>

                      </div>


                      {user.role === "student" &&
                        user.parentPhone && (

                          <div className="contact-secondary">

                            Parent:{" "}
                            {user.parentPhone}

                          </div>

                        )}


                      {user.role === "student" &&
                        user.guardianPhone && (

                          <div className="contact-secondary">

                            Guardian:{" "}
                            {user.guardianPhone}

                          </div>

                        )}

                    </div>

                  </td>


                  {/* =================================
                      COURSE / PROGRAM
                  ================================= */}

                  <td>

                    {user.role === "student" ? (

                      <div className="course-info">

                        <div className="course-name">

                          <FaBookOpen />

                          <span>

                            {user.program ||
                              "No program"}

                          </span>

                        </div>


                        {user.cohort && (

                          <span className="cohort-text">

                            {user.cohort}

                          </span>

                        )}

                      </div>

                    ) : (

                      <span className="not-applicable">
                        —
                      </span>

                    )}

                  </td>


                  {/* =================================
                      ROLE
                  ================================= */}

                  <td>

                    <span
                      className={`role-badge role-${user.role}`}
                    >

                      {user.role}

                    </span>

                  </td>


                  {/* =================================
                      STATUS
                  ================================= */}

                  <td>

                    <span
                      className={`status-badge status-${user.status}`}
                    >

                      {user.status}

                    </span>

                  </td>


                  {/* =================================
                      ACTIONS
                  ================================= */}

                  <td>

                    <div className="table-actions">


                      {/* =============================
                          EDIT
                      ============================= */}

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(user)
                        }
                        title="Edit User"
                      >

                        <FaEdit />

                      </button>


                      {/* =============================
                          SUSPEND / UNSUSPEND
                      ============================= */}

                      {user.status === "suspended" ? (

                        <button
                          type="button"
                          className="activate-btn"
                          onClick={() =>
                            handleStatusChange(
                              user
                            )
                          }
                          title="Reactivate User"
                        >

                          <FaCheckCircle />

                        </button>

                      ) : (

                        <button
                          type="button"
                          className="suspend-btn"
                          onClick={() =>
                            handleStatusChange(
                              user
                            )
                          }
                          title="Suspend User"
                        >

                          <FaBan />

                        </button>

                      )}


                      {/* =============================
                          DELETE
                      ============================= */}

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            user._id
                          )
                        }
                        title="Delete User"
                      >

                        <FaTrash />

                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default UserTable;