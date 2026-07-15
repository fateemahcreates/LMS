import "../styles/Navbar.css";
import { NavLink } from "react-router-dom";

import {
  FaBars,
  FaGraduationCap,
  FaUserCircle,
} from "react-icons/fa";

import { IoNotificationsOutline } from "react-icons/io5";

function Navbar({ setSidebarOpen }) {
  return (
    <header className="navbar">

      {/* Left Section */}
      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <FaBars />
        </button>

        <div className="navbar-logo">
          <FaGraduationCap className="logo-icon" />
          <span>LMS Portal</span>
        </div>

      </div>

      {/* Right Section */}
      <div className="navbar-right">

        <button className="notification-btn">
          <IoNotificationsOutline />
        </button>

        <div className="user-profile">
          <FaUserCircle className="user-icon" />

          <div className="user-details">
            <h4>Admin User</h4>
            <span>Administrator</span>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;