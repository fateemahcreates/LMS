import { useEffect, useState } from "react";

import {
  FaPlus,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import { getUsers } from "../services/userService";

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

    // Parent / Guardian
    parentPhone: "",
    guardianPhone: "",

    // Student information
    program: "",
    cohort: "",

    // Account status
    status: "active",
  };


  // ==========================================
  // USERS
  // ==========================================

  const [users, setUsers] = useState([]);


  // ==========================================
  // FORM
  // ==========================================

  const [formData, setFormData] =
    useState(initialState);

  const [editingUser, setEditingUser] =
    useState(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);


  // ==========================================
  // FILTERS
  // ==========================================

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [programFilter, setProgramFilter] =
    useState("All");

  const [courseFilter, setCourseFilter] =
    useState("All");


  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {

    try {

      const res = await getUsers();

      /*
       * Your API currently returns the users
       * directly as res.data.
       */

      setUsers(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "Fetch users error:",
        error
      );

      notify.apiError(error);

    }

  };


  // ==========================================
  // INITIAL FETCH
  // ==========================================

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

      // Never populate password
      password: "",

      // General information
      phone:
        user.phone || "",

      gender:
        user.gender || "",

      dateOfBirth:
        user.dateOfBirth
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


      // Parent / Guardian
      parentPhone:
        user.parentPhone || "",

      guardianPhone:
        user.guardianPhone || "",


      // Student information
      program:
        user.program || "",

      cohort:
        user.cohort || "",


      // Status
      status:
        user.status || "active",

    });

    setDrawerOpen(true);

  };


  // ==========================================
  // PROGRAM OPTIONS
  // ==========================================

  const programs = [
    ...new Set(

      users
        .filter(
          (user) =>
            user.role === "student" &&
            user.program
        )
        .map(
          (user) =>
            user.program
        )

    ),
  ];


  // ==========================================
  // COURSE OPTIONS
  // ==========================================

  const courses = [];


  users.forEach((user) => {

    if (
      user.role === "student" &&
      Array.isArray(user.courses)
    ) {

      user.courses.forEach(
        (course) => {

          if (
            course?._id &&
            !courses.some(
              (existingCourse) =>
                existingCourse._id ===
                course._id
            )
          ) {

            courses.push(course);

          }

        }
      );

    }

  });


  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers =
    users.filter((user) => {

      const searchValue =
        search
          .toLowerCase()
          .trim();


      // ========================================
      // SEARCH
      // ========================================

      const matchesSearch =
        !searchValue ||

        user.name
          ?.toLowerCase()
          .includes(searchValue) ||

        user.email
          ?.toLowerCase()
          .includes(searchValue) ||

        user.studentId
          ?.toLowerCase()
          .includes(searchValue) ||

        user.phone
          ?.toLowerCase()
          .includes(searchValue);


      // ========================================
      // ROLE
      // ========================================

      const matchesRole =
        roleFilter === "All" ||
        user.role ===
          roleFilter.toLowerCase();


      // ========================================
      // STATUS
      // ========================================

      const matchesStatus =
        statusFilter === "All" ||
        user.status ===
          statusFilter.toLowerCase();


      // ========================================
      // PROGRAM
      // ========================================

      const matchesProgram =
        programFilter === "All" ||
        user.program ===
          programFilter;


      // ========================================
      // COURSE
      // ========================================

      const matchesCourse =
        courseFilter === "All" ||
        (
          Array.isArray(user.courses) &&
          user.courses.some(
            (course) =>
              course?._id ===
              courseFilter
          )
        );


      // ========================================
      // FINAL RESULT
      // ========================================

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesProgram &&
        matchesCourse
      );

    });


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
  // ACTIVE USERS
  // ==========================================

  const activeUsers =
    users.filter(
      (user) =>
        user.status === "active"
    ).length;


  // ==========================================
  // SUSPENDED USERS
  // ==========================================

  const suspendedUsers =
    users.filter(
      (user) =>
        user.status === "suspended"
    ).length;


  // ==========================================
  // CLOSE DRAWER
  // ==========================================

  const closeDrawer = () => {

    setDrawerOpen(false);

    setEditingUser(null);

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <main className="users-page">


      {/* =====================================
          HEADER
      ====================================== */}

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
          type="button"
          className="new-user-btn"
          onClick={handleNewUser}
        >

          <FaPlus />

          New User

        </button>

      </div>



      {/* =====================================
          STATS
      ====================================== */}

      <div className="user-stats">


        {/* TOTAL */}

        <div className="stat-card">

          <h2>
            {users.length}
          </h2>

          <span>
            Total Users
          </span>

        </div>


        {/* STUDENTS */}

        <div className="stat-card">

          <h2>
            {students}
          </h2>

          <span>
            Students
          </span>

        </div>


        {/* INSTRUCTORS */}

        <div className="stat-card">

          <h2>
            {instructors}
          </h2>

          <span>
            Instructors
          </span>

        </div>


        {/* ADMINS */}

        <div className="stat-card">

          <h2>
            {admins}
          </h2>

          <span>
            Administrators
          </span>

        </div>


        {/* ACTIVE */}

        <div className="stat-card">

          <h2>
            {activeUsers}
          </h2>

          <span>
            Active Users
          </span>

        </div>


        {/* SUSPENDED */}

        <div className="stat-card">

          <h2>
            {suspendedUsers}
          </h2>

          <span>
            Suspended
          </span>

        </div>

      </div>



      {/* =====================================
          SEARCH + FILTERS
      ====================================== */}

      <div className="users-toolbar">


        {/* SEARCH */}

        <div className="gmt-users-search">

          <FaSearch
            className="gmt-users-search-icon"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>



        {/* ROLE FILTER */}

        <select
          className="gmt-users-select"
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(
              e.target.value
            )
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



        {/* STATUS FILTER */}

        <select
          className="gmt-users-select"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value
            )
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



        {/* PROGRAM FILTER */}

        <select
          className="gmt-users-select"
          value={programFilter}
          onChange={(e) =>
            setProgramFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Programs
          </option>

          {programs.map(
            (program) => (

              <option
                key={program}
                value={program}
              >
                {program}
              </option>

            )
          )}

        </select>



        {/* COURSE FILTER */}

        <select
          className="gmt-users-select"
          value={courseFilter}
          onChange={(e) =>
            setCourseFilter(
              e.target.value
            )
          }
        >

          <option value="All">
            All Courses
          </option>

          {courses.map(
            (course) => (

              <option
                key={course._id}
                value={course._id}
              >
                {course.title}
              </option>

            )
          )}

        </select>

      </div>



      {/* =====================================
          TABLE
      ====================================== */}

      <UserTable
        users={filteredUsers}
        refreshUsers={fetchUsers}
        handleEdit={handleEdit}
      />



      {/* =====================================
          DRAWER BACKDROP
      ====================================== */}

      {drawerOpen && (

        <div
          className="drawer-backdrop"
          onClick={closeDrawer}
        />

      )}



      {/* =====================================
          USER DRAWER
      ====================================== */}

      <div
        className={`side-drawer ${
          drawerOpen
            ? "open"
            : ""
        }`}
      >


        {/* DRAWER HEADER */}

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
            onClick={closeDrawer}
          >

            <FaTimes />

          </button>

        </div>



        {/* USER FORM */}

        <UserForm
          formData={formData}
          setFormData={setFormData}
          editingUser={editingUser}
          refreshUsers={fetchUsers}
          closeDrawer={closeDrawer}
        />

      </div>

    </main>

  );

}


export default Users;