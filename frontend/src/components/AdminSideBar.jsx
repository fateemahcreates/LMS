import { NavLink, useNavigate } from "react-router-dom";

import {
  FaChartPie,
  FaUserGraduate,
  FaBookOpen,
  FaClipboardList,
  FaClipboardCheck,
  FaCertificate,
  FaBullhorn,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

import "../styles/AdminSidebar.css";

const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: FaChartPie,
      },
    ],
  },

  {
    title: "ACADEMIC",
    items: [
      {
        label: "Students",
        path: "/students",
        icon: FaUserGraduate,
      },
      {
        label: "Courses",
        path: "/courses",
        icon: FaBookOpen,
      },
      {
        label: "Assignments",
        path: "/assignments",
        icon: FaClipboardList,
      },
      {
        label: "Enrollments",
        path: "/enrollments",
        icon: FaClipboardCheck,
      },
      {
        label: "Certificates",
        path: "/admin/certificates",
        icon: FaCertificate,
      },
    ],
  },

  {
    title: "COMMUNICATION",
    items: [
      {
        label: "Announcements",
        path: "/admin/announcements",
        icon: FaBullhorn,
      },
    ],
  },

  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "Users",
        path: "/users",
        icon: FaUsers,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: FaCog,
      },
    ],
  },
];
function AdminSidebar({ sidebarOpen, closeSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 992) {
      closeSidebar();
    }
  };

  return (
    <aside
      className={`gmt-admin-sidebar ${
        sidebarOpen
          ? "gmt-admin-sidebar-open"
          : "gmt-admin-sidebar-closed"
      }`}
    >
      {/* ==========================
          Mobile Close Button
      ========================== */}

      <button
        className="gmt-admin-sidebar-close"
        onClick={closeSidebar}
      >
        <FaTimes />
      </button>

      {/* ==========================
          Logo
      ========================== */}

      <div className="gmt-admin-sidebar-brand">

        <div className="gmt-admin-sidebar-logo">
          GMT
        </div>

        <div>

          <h2>GMT Software</h2>

          <p>Learning Management System</p>

        </div>

      </div>

      <nav className="gmt-admin-sidebar-menu">

  {menuSections.map((section) => (

    <div
      key={section.title}
      className="gmt-admin-sidebar-section"
    >

      <span className="gmt-admin-sidebar-heading">
        {section.title}
      </span>

      {section.items.map((item) => {

        const Icon = item.icon;

        return (

          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `gmt-admin-sidebar-link ${
                isActive
                  ? "gmt-admin-sidebar-link-active"
                  : ""
              }`
            }
          >

            <Icon />

            <span>{item.label}</span>

          </NavLink>

        );

      })}

    </div>

  ))}

</nav>

      {/* ==========================
          Footer
      ========================== */}

      <div className="gmt-admin-sidebar-footer">

        <button
          className="gmt-admin-sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;