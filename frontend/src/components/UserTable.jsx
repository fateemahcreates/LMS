import {
  FaTrash,
  FaEdit,
} from "react-icons/fa";

import { deleteUser } from "../services/userService";
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
        notify.apiError(error);
      }
    });
  };

  return (
    <div className="user-table-wrapper">

      <div className="user-table-container">

        <table className="user-table">

          <thead>

            <tr>

              <th>User</th>

              <th>Student ID</th>

              <th>Role</th>

              <th>Status</th>

              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
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