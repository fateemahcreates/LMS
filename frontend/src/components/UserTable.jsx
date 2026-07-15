import { deleteUser } from "../services/userService";

import "../styles/UserTable.css";

function UserTable({
  users,
  refreshUsers,
}) {

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    try {

      await deleteUser(id);

      refreshUsers();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Unable to delete user."
      );

    }
  };

  return (
    <div className="user-table-container">

      <table className="user-table">

        <thead>

          <tr>

            <th>Name</th>

            <th>Email</th>

            <th>Role</th>

            <th>Status</th>

            <th>Action</th>

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

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>
  <span className={`role-badge role-${user.role}`}>
    {user.role}
  </span>
</td>

                <td>
  <span className={`status-badge status-${user.status}`}>
    {user.status}
  </span>
</td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(user._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default UserTable;