import "../../styles/InstructorSidebar.css";

import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTimes,
  FaChartPie,
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  FaBullhorn,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaCalendarCheck,
  FaCalendarPlus,
} from "react-icons/fa";

import logo from "../../assets/GMT Software logo.jpeg";

import { notify } from "../../utils/notify";


function InstructorSidebar({
  sidebarOpen,
  setSidebarOpen,
}) {

  const navigate = useNavigate();


  // ============================================================
  // CURRENT USER
  // ============================================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {

    notify.confirmLogout(() => {

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      setSidebarOpen(false);

      navigate("/login");

    });

  };


  // ============================================================
  // CLOSE SIDEBAR ON MOBILE
  // ============================================================

  const handleNavigation = () => {

    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }

  };


  // ============================================================
  // MENU ITEMS
  // ============================================================

  const menuItems = [

    // ----------------------------------------------------------
    // DASHBOARD
    // ----------------------------------------------------------

    {
      name: "Dashboard",
      path: "/instructor",
      icon: <FaChartPie />,
    },


    // ----------------------------------------------------------
    // MY COURSES
    // ----------------------------------------------------------

    {
      name: "My Courses",
      path: "/instructor/courses",
      icon: <FaBookOpen />,
    },


    // ----------------------------------------------------------
    // ATTENDANCE
    // ----------------------------------------------------------

    {
      name: "Attendance",
      path: "/instructor/attendance",
      icon: <FaCalendarCheck />,
    },


    // ----------------------------------------------------------
    // CLASS SESSIONS
    // ----------------------------------------------------------

    {
      name: "Class Sessions",
      path: "/instructor/class-sessions",
      icon: <FaCalendarPlus />,
    },


    // ----------------------------------------------------------
    // STUDENTS
    // ----------------------------------------------------------

    {
      name: "Students",
      path: "/instructor/students",
      icon: <FaUsers />,
    },


    // ----------------------------------------------------------
    // ASSIGNMENTS
    // ----------------------------------------------------------

    {
      name: "Assignments",
      path: "/instructor/assignments",
      icon: <FaClipboardList />,
    },


    // ----------------------------------------------------------
    // ANNOUNCEMENTS
    // ----------------------------------------------------------

    {
      name: "Announcements",
      path: "/instructor/announcements",
      icon: <FaBullhorn />,
    },

  ];


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <aside
      className={`instructor-sidebar ${
        sidebarOpen
          ? "instructor-sidebar-open"
          : "instructor-sidebar-closed"
      }`}
    >


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="instructor-sidebar-header">


        <div className="instructor-sidebar-brand">


          <img
            src={logo}
            alt="GMT Software Academy"
            className="instructor-sidebar-logo"
          />


          <div>

            <h3>
              GMT Software
            </h3>

            <span>
              Instructor Portal
            </span>

          </div>


        </div>


        {/* CLOSE SIDEBAR */}

        <button
          type="button"
          className="instructor-sidebar-close"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close sidebar"
        >

          <FaTimes />

        </button>


      </div>


      {/* ======================================================
          PROFILE CARD
      ====================================================== */}

      <div className="instructor-sidebar-profile">


        <FaUserCircle />


        <div>

          <h4>
            {user.name || "Instructor"}
          </h4>

          <span>
            Instructor
          </span>

        </div>


      </div>


      {/* ======================================================
          MAIN MENU
      ====================================================== */}

      <nav className="instructor-sidebar-menu">


        {menuItems.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            end={
              item.path === "/instructor"
            }
            className={({ isActive }) =>
              isActive
                ? "instructor-sidebar-link active"
                : "instructor-sidebar-link"
            }
            onClick={handleNavigation}
          >

            <span className="instructor-sidebar-icon">

              {item.icon}

            </span>


            <span>
              {item.name}
            </span>


          </NavLink>

        ))}


      </nav>


      {/* ======================================================
          BOTTOM MENU
      ====================================================== */}

      <div className="instructor-sidebar-bottom">


        {/* SETTINGS */}

        <NavLink
          to="/instructor/settings"
          className={({ isActive }) =>
            isActive
              ? "instructor-sidebar-link active"
              : "instructor-sidebar-link"
          }
          onClick={handleNavigation}
        >

          <span className="instructor-sidebar-icon">

            <FaCog />

          </span>

          <span>
            Settings
          </span>

        </NavLink>


        {/* LOGOUT */}

        <button
          type="button"
          className="instructor-sidebar-logout"
          onClick={handleLogout}
        >

          <span className="instructor-sidebar-icon">

            <FaSignOutAlt />

          </span>

          <span>
            Logout
          </span>

        </button>


      </div>


    </aside>

  );

}


export default InstructorSidebar;