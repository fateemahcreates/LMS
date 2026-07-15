import "../styles/SideBar.css";

import { NavLink, useNavigate } from "react-router-dom";
import { FaClipboardCheck } from "react-icons/fa";


import {
  FaGraduationCap,
  FaChartPie,
  FaUserGraduate,
  FaBookOpen,
  FaUsers,
  FaCog,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

function SideBar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  // ==========================
  // Logout
  // ==========================
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    // Remove saved login data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Close sidebar on mobile
    setSidebarOpen(false);

    // Redirect to login
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        {/* ==========================
            Sidebar Header
        ========================== */}

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaGraduationCap className="logo-icon" />
            <span>LMS Portal</span>
          </div>

          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* ==========================
            Navigation
        ========================== */}

        <nav className="sidebar-nav">

          <NavLink
            to="/"
            end
            onClick={() => setSidebarOpen(false)}
          >
            <FaChartPie />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/students"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserGraduate />
            <span>Students</span>
          </NavLink>

          <NavLink
            to="/courses"
            onClick={() => setSidebarOpen(false)}
          >
            <FaBookOpen />
            <span>Courses</span>
          </NavLink>

          <NavLink to="/enrollments">
    <FaClipboardCheck />
    <span>Enrollments</span>
</NavLink>

          <NavLink
            to="/users"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers />
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
          >
            <FaCog />
            <span>Settings</span>
          </NavLink>

        </nav>

        {/* ==========================
            Footer
        ========================== */}

        <div className="sidebar-footer">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

          <p>LMS Portal</p>

          <small>Version 1.0</small>

        </div>

      </aside>
    </>
  );
}

export default SideBar;