import { useEffect, useState } from "react";

import {
  FaBars,
  FaSearch,
  FaBell,
  FaChevronDown,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import logo from "../../assets/GMT Software logo.jpeg";

import "../../styles/InstructorNavbar.css";

import NotificationDropdown from "../NotificationDropdown";
import api from "../../services/api";

function InstructorNavbar({
  sidebarOpen,
  setSidebarOpen,
}) {
  // ============================================================
  // STATE
  // ============================================================

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  // ============================================================
  // GET UNREAD NOTIFICATION COUNT
  // ============================================================

  const fetchUnreadCount = async () => {
    try {
      const response =
        await api.get(
          "/notifications/unread-count"
        );

      setUnreadCount(
        response.data?.count || 0
      );

    } catch (error) {
      console.error(
        "Failed to load notification count:",
        error
      );
    }
  };

  // ============================================================
  // LOAD NOTIFICATION COUNT
  // ============================================================

  useEffect(() => {
    fetchUnreadCount();

    // Refresh every 30 seconds
    const interval =
      setInterval(() => {
        fetchUnreadCount();
      }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ============================================================
  // HANDLE NOTIFICATION OPEN
  // ============================================================

  const handleNotificationToggle = () => {
    setNotificationOpen(
      (previous) => !previous
    );

    // Close profile dropdown
    setProfileOpen(false);
  };

  // ============================================================
  // HANDLE NOTIFICATION READ
  // ============================================================

  const handleNotificationUpdate = () => {
    fetchUnreadCount();
  };

  // ============================================================
  // HANDLE LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // ============================================================
  // HANDLE PROFILE
  // ============================================================

  const handleProfileToggle = () => {
    setProfileOpen(
      (previous) => !previous
    );

    // Close notifications
    setNotificationOpen(false);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <header className="instructor-navbar">

      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <div className="instructor-navbar-left">

        <button
          type="button"
          className="instructor-navbar-menu-btn"
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>


        <div className="instructor-navbar-brand">

          <img
            src={logo}
            alt="GMT Software Academy"
            className="instructor-navbar-logo"
          />


          <div>

            <h3>
              GMT Software Academy
            </h3>

            <span>
              Instructor Portal
            </span>

          </div>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="instructor-navbar-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search courses, students..."
        />

      </div>


      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <div className="instructor-navbar-right">


        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <div className="instructor-navbar-notification-wrapper">

          <button
            type="button"
            className={`instructor-navbar-icon-btn ${
              notificationOpen
                ? "active"
                : ""
            }`}
            title="Notifications"
            onClick={
              handleNotificationToggle
            }
            aria-label="Notifications"
          >

            <FaBell />

            {unreadCount > 0 && (

              <span className="instructor-navbar-notification-badge">

                {unreadCount > 99
                  ? "99+"
                  : unreadCount}

              </span>

            )}

          </button>


          {/* =================================================
              NOTIFICATION DROPDOWN
          ================================================= */}

          {notificationOpen && (

            <NotificationDropdown
              onClose={() =>
                setNotificationOpen(false)
              }
              onNotificationUpdate={
                handleNotificationUpdate
              }
            />

          )}

        </div>


        {/* ===================================================
            PROFILE
        =================================================== */}

        <div
          className="instructor-navbar-profile"
        >

          <button
            type="button"
            className="instructor-navbar-profile-btn"
            onClick={
              handleProfileToggle
            }
          >

            <FaUserCircle />


            <div className="instructor-navbar-user-info">

              <strong>
                {user?.name ||
                  "Instructor"}
              </strong>

              <small>
                Instructor
              </small>

            </div>


            <FaChevronDown />

          </button>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {profileOpen && (

            <div className="instructor-navbar-dropdown">


              {/* HEADER */}

              <div className="instructor-navbar-dropdown-header">

                <FaUserCircle />

                <div>

                  <strong>
                    {user?.name ||
                      "Instructor"}
                  </strong>

                  <span>
                    {user?.email ||
                      ""}
                  </span>

                </div>

              </div>


              {/* PROFILE */}

              <button
                type="button"
              >

                <FaUserCircle />

                Profile

              </button>


              {/* SETTINGS */}

               <button
                type="button"
                className="gmt-instructor-navbar-dropdown-item"
                onClick={() =>
                  openSettings("account")
                }
              >

                <FaCog />

                <span>
                  Settings
                </span>

              </button>


              {/* LOGOUT */}

              <button
                type="button"
                className="instructor-navbar-logout"
                onClick={
                  handleLogout
                }
              >

                <FaSignOutAlt />

                Logout

              </button>


            </div>

          )}

        </div>

      </div>

    </header>
  );
}

export default InstructorNavbar;