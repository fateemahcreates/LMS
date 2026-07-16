import "../styles/SideBar.css";

import { NavLink, useNavigate } from "react-router-dom";

import {
  FaGraduationCap,
  FaBookOpen,
  FaClipboardList,
  FaChartLine,
  FaBullhorn,
  FaUser,
  FaCog,
  FaTimes,
  FaSignOutAlt,
  FaAward,
  FaCompass,
} from "react-icons/fa";

function StudentSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        {/* ===========================
            Header
        =========================== */}

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaGraduationCap className="logo-icon" />

            <span>Student Portal</span>
          </div>

          <button
            className="close-btn"
            onClick={closeSidebar}
          >
            <FaTimes />
          </button>
        </div>

        {/* ===========================
            Navigation
        =========================== */}

      <nav className="sidebar-nav">

  <NavLink
    to="/student"
    onClick={closeSidebar}
  >
    <FaChartLine />
    <span>Dashboard</span>
  </NavLink>

  <NavLink
    to="/browse-courses"
    onClick={closeSidebar}
  >
    <FaCompass />
    <span>Browse Courses</span>
  </NavLink>

  <NavLink
    to="/my-courses"
    onClick={closeSidebar}
  >
    <FaBookOpen />
    <span>My Courses</span>
  </NavLink>

  <NavLink
  to="/student/assignments"
  onClick={closeSidebar}
>
  <FaClipboardList />
  <span>Assignments</span>
</NavLink>

  <NavLink
    to="/announcements"
    onClick={closeSidebar}
  >
    <FaBullhorn />
    <span>Announcements</span>
  </NavLink>

  <NavLink
    to="/certification"
    onClick={closeSidebar}
  >
    <FaAward />
    <span>Certification</span>
  </NavLink>

  <NavLink
    to="/profile"
    onClick={closeSidebar}
  >
    <FaUser />
    <span>Profile</span>
  </NavLink>

  <NavLink
    to="/student-settings"
    onClick={closeSidebar}
  >
    <FaCog />
    <span>Settings</span>
  </NavLink>

</nav>

        {/* ===========================
            Footer
        =========================== */}

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

          <p>Tech Academy LMS</p>

          <small>Version 1.0</small>
        </div>
      </aside>
    </>
  );
}

export default StudentSidebar;