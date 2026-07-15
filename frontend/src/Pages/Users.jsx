import { useEffect, useState } from "react";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import { getUsers } from "../services/userService";

import "../styles/Users.css";

function Users() {
  const [users, setUsers] = useState([]);

  // ==========================
  // Fetch Users
  // ==========================
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="users-page">

      {/* Header */}

      <div className="users-header">
        <h2>User Management</h2>

        <p>
          Manage administrators, instructors and students
          from one central location.
        </p>
      </div>

      {/* Create User */}

      <section className="user-form-section">

        <div className="section-header">
          <h3>Create New User</h3>

          <p>
            Add a new administrator, instructor or student.
          </p>
        </div>

        <UserForm refreshUsers={fetchUsers} />

      </section>

      {/* User Table */}

      <section className="user-table-section">

        <div className="section-header">
          <h3>System Users</h3>

          <p>
            View and manage all registered users.
          </p>
        </div>

        <UserTable
          users={users}
          refreshUsers={fetchUsers}
        />

      </section>

    </main>
  );
}

export default Users;