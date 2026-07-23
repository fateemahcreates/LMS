import "../styles/SideBar.css";

import { NavLink, useNavigate } from "react-router-dom";
import { notify } from "../utils/notify";

import {
  FaGraduationCap,
  FaChartPie,
  FaUserGraduate,
  FaBookOpen,
  FaClipboardList,
  FaBullhorn,
  FaUsers,
  FaCog,
  FaTimes,
  FaSignOutAlt,
  FaClipboardCheck,
  FaCertificate,
} from "react-icons/fa";

function SideBar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  // ==========================
  // Logout
  // ==========================
  const handleLogout = () => {

    notify.confirmLogout(() => {

      // Remove saved login data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Close sidebar
      setSidebarOpen(false);

      // Notification
      notify.info("You have been logged out.");

      // Redirect after toast displays
      setTimeout(() => {
        navigate("/login");
      }, 800);

    });

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

            <span>
              LMS Portal
            </span>

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
            <span>
              Dashboard
            </span>
          </NavLink>



          <NavLink
            to="/students"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUserGraduate />
            <span>
              Students
            </span>
          </NavLink>



          <NavLink
            to="/courses"
            onClick={() => setSidebarOpen(false)}
          >
            <FaBookOpen />
            <span>
              Courses
            </span>
          </NavLink>



          <NavLink
            to="/enrollments"
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardCheck />
            <span>
              Enrollments
            </span>
          </NavLink>



          <NavLink
            to="/assignments"
            onClick={() => setSidebarOpen(false)}
          >
            <FaClipboardList />
            <span>
              Assignments
            </span>
          </NavLink>



          <NavLink
            to="/admin/announcements"
            onClick={() => setSidebarOpen(false)}
          >
            <FaBullhorn />
            <span>
              Announcements
            </span>
          </NavLink>



          <NavLink
            to="/admin/certificates"
            onClick={() => setSidebarOpen(false)}
          >
            <FaCertificate />
            <span>
              Certificates
            </span>
          </NavLink>



          <NavLink
            to="/users"
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers />
            <span>
              Users
            </span>
          </NavLink>



          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
          >
            <FaCog />
            <span>
              Settings
            </span>
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

            <span>
              Logout
            </span>

          </button>



          <p>
            LMS Portal
          </p>


          <small>
            Version 1.0
          </small>


        </div>


      </aside>
    </>
  );
}


export default SideBar;