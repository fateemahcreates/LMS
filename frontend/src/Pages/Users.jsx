import { useEffect, useState } from "react";

import {
  FaPlus,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import {
  getUsers,
} from "../services/userService";

import { notify } from "../utils/notify";

import "../styles/Users.css";
import "../styles/Drawer.css";

function Users() {
  // ==========================================
  // INITIAL STATE
  // ==========================================

  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "student",

    // General user information
    phone: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    bio: "",
    avatar: "",

    // Student information
    program: "",
    cohort: "",

    // Account status
    status: "active",
  };

  const [users, setUsers] = useState([]);

  const [formData, setFormData] =
    useState(initialState);

  const [editingUser, setEditingUser] =
    useState(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  // ==========================================
  // FILTERS
  // ==========================================

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      setUsers(res.data);

    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      notify.apiError(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // OPEN CREATE USER DRAWER
  // ==========================================

  const handleNewUser = () => {
    setEditingUser(null);

    setFormData({
      ...initialState,
    });

    setDrawerOpen(true);
  };

  // ==========================================
  // EDIT USER
  // ==========================================

  const handleEdit = (user) => {
    setEditingUser(user);

    setFormData({
      ...initialState,

      ...user,

      // Never populate password when editing
      password: "",

      // Make sure optional fields don't
      // become undefined
      phone: user.phone || "",

      gender: user.gender || "",

      dateOfBirth: user.dateOfBirth
        ? user.dateOfBirth.split("T")[0]
        : "",

      nationality:
        user.nationality || "",

      address:
        user.address || "",

      bio:
        user.bio || "",

      avatar:
        user.avatar || "",

      program:
        user.program || "",

      cohort:
        user.cohort || "",

      status:
        user.status || "active",
    });

    setDrawerOpen(true);
  };

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = users.filter(
    (user) => {
      const searchValue =
        search.toLowerCase().trim();

      const matchesSearch =
        user.name
          ?.toLowerCase()
          .includes(searchValue) ||

        user.email
          ?.toLowerCase()
          .includes(searchValue) ||

        user.studentId
          ?.toLowerCase()
          .includes(searchValue);

      const matchesRole =
        roleFilter === "All" ||
        user.role ===
          roleFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        user.status ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    }
  );

  // ==========================================
  // STATS
  // ==========================================

  const students =
    users.filter(
      (user) =>
        user.role === "student"
    ).length;

  const instructors =
    users.filter(
      (user) =>
        user.role === "instructor"
    ).length;

  const admins =
    users.filter(
      (user) =>
        user.role === "admin"
    ).length;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="users-page">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="users-page-header">

        <div>

          <h1>
            User Management
          </h1>

          <p>
            Manage administrators,
            instructors and students
            across GMT Software Academy.
          </p>

        </div>

        <button
          className="new-user-btn"
          onClick={handleNewUser}
        >
          <FaPlus />

          New User
        </button>

      </div>


      {/* ==========================
          STATS
      ========================== */}

      <div className="user-stats">

        <div className="stat-card">

          <h2>
            {users.length}
          </h2>

          <span>
            Total Users
          </span>

        </div>


        <div className="stat-card">

          <h2>
            {students}
          </h2>

          <span>
            Students
          </span>

        </div>


        <div className="stat-card">

          <h2>
            {instructors}
          </h2>

          <span>
            Instructors
          </span>

        </div>


        <div className="stat-card">

          <h2>
            {admins}
          </h2>

          <span>
            Administrators
          </span>

        </div>

      </div>


      {/* ==========================
          SEARCH + FILTERS
      ========================== */}

      <div className="users-toolbar">

        <div className="gmt-users-search">

          <FaSearch
            className="gmt-users-search-icon"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <select
          className="gmt-users-select"
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >

          <option value="All">
            All Roles
          </option>

          <option value="Admin">
            Administrators
          </option>

          <option value="Instructor">
            Instructors
          </option>

          <option value="Student">
            Students
          </option>

        </select>


        <select
          className="gmt-users-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>

          <option value="Suspended">
            Suspended
          </option>

        </select>

      </div>


      {/* ==========================
          TABLE
      ========================== */}

      <UserTable
        users={filteredUsers}
        refreshUsers={fetchUsers}
        handleEdit={handleEdit}
      />


      {/* ==========================
          BACKDROP
      ========================== */}

      {drawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() =>
            setDrawerOpen(false)
          }
        />
      )}


      {/* ==========================
          DRAWER
      ========================== */}

      <div
        className={`side-drawer ${
          drawerOpen ? "open" : ""
        }`}
      >

        <div className="drawer-header">

          <div>

            <h2>
              {editingUser
                ? "Edit User"
                : "Create User"}
            </h2>

            <p>
              {editingUser
                ? "Update platform user information."
                : "Create or manage platform users."}
            </p>

          </div>


          <button
            type="button"
            className="close-btn"
            onClick={() =>
              setDrawerOpen(false)
            }
          >
            <FaTimes />
          </button>

        </div>


        <UserForm
          formData={formData}
          setFormData={setFormData}
          editingUser={editingUser}
          refreshUsers={fetchUsers}
          closeDrawer={() =>
            setDrawerOpen(false)
          }
        />

      </div>

    </main>
  );
}

export default Users;