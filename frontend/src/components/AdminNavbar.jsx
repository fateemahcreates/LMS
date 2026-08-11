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

import logo from "../assets/GMT Software logo.jpeg";

import "../styles/AdminNavbar.css";

import NotificationDropdown from "./NotificationDropdown";

import api from "../services/api";


// ============================================================
// ADMIN NAVBAR
// ============================================================

function AdminNavbar({
  toggleSidebar,
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


  // ============================================================
  // CURRENT USER
  // ============================================================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};


  const firstName =
    user?.name?.split(" ")[0] ||
    "Administrator";


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
        Number(
          response.data?.count
        ) || 0
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
  // HANDLE NOTIFICATION UPDATE
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


    window.location.href =
      "/login";

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
  // OPEN SETTINGS
  // ============================================================

  const openSettings = (section) => {

    setProfileOpen(false);

    setNotificationOpen(false);


    window.location.href =
      `/settings?section=${section}`;

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <header className="gmt-admin-navbar">


      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <div className="gmt-admin-navbar-left">


        {/* SIDEBAR */}

        <button
          type="button"
          className="gmt-admin-navbar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >

          <FaBars />

        </button>


        {/* LOGO */}

        <img
          src={logo}
          alt="GMT Software"
          className="gmt-admin-navbar-logo"
        />


        {/* BRAND */}

        <div className="gmt-admin-navbar-title">

          <h2>
            GMT LMS
          </h2>

          <span>
            Administration Portal
          </span>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="gmt-admin-navbar-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search students, courses, instructors..."
        />

      </div>


      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <div className="gmt-admin-navbar-right">


        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <div className="gmt-admin-navbar-notification-wrapper">


          <button
            type="button"
            className={`gmt-admin-navbar-icon ${
              notificationOpen
                ? "active"
                : ""
            }`}
            title="Notifications"
            aria-label="Notifications"
            onClick={
              handleNotificationToggle
            }
          >

            <FaBell />


            {/* UNREAD BADGE */}

            {unreadCount > 0 && (

              <span className="gmt-admin-navbar-badge">

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
            SETTINGS
        =================================================== */}

        <button
          type="button"
          className="gmt-admin-navbar-icon"
          title="Settings"
          aria-label="Settings"
          onClick={() =>
            openSettings("account")
          }
        >

          <FaCog />

        </button>


        {/* ===================================================
            PROFILE
        =================================================== */}

        <div
          className="gmt-admin-navbar-profile"
        >


          <button
            type="button"
            className="gmt-admin-navbar-profile-btn"
            onClick={
              handleProfileToggle
            }
          >

            <FaUserCircle
              className="gmt-admin-navbar-avatar"
            />


            <div className="gmt-admin-navbar-user">

              <small>
                Welcome Back
              </small>

              <h4>
                {firstName}
              </h4>

            </div>


            <FaChevronDown />

          </button>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {profileOpen && (

            <div className="gmt-admin-navbar-dropdown">


              {/* HEADER */}

              <div className="gmt-admin-navbar-dropdown-header">

                <FaUserCircle
                  className="gmt-admin-navbar-dropdown-avatar"
                />

                <div>

                  <h3>
                    {user?.name ||
                      "Administrator"}
                  </h3>

                  <p>
                    {user?.email ||
                      "admin@gmtsoftware.com"}
                  </p>

                </div>

              </div>


              <div className="gmt-admin-navbar-divider" />


              {/* =================================================
                  PROFILE
              ================================================= */}

              <button
                type="button"
                className="gmt-admin-navbar-dropdown-item"
                onClick={() =>
                  openSettings("profile")
                }
              >

                <FaUserCircle />

                <span>
                  Profile
                </span>

              </button>


              {/* =================================================
                  NOTIFICATIONS
              ================================================= */}

              <button
                type="button"
                className="gmt-admin-navbar-dropdown-item"
                onClick={() =>
                  openSettings(
                    "notifications"
                  )
                }
              >

                <FaBell />

                <span>
                  Notifications
                </span>


                {unreadCount > 0 && (

                  <span className="gmt-admin-navbar-dropdown-badge">

                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}

                  </span>

                )}

              </button>


              {/* =================================================
                  SETTINGS
              ================================================= */}

              <button
                type="button"
                className="gmt-admin-navbar-dropdown-item"
                onClick={() =>
                  openSettings("account")
                }
              >

                <FaCog />

                <span>
                  Settings
                </span>

              </button>


              <div className="gmt-admin-navbar-divider" />


              {/* =================================================
                  LOGOUT
              ================================================= */}

              <button
                type="button"
                className="gmt-admin-navbar-logout"
                onClick={
                  handleLogout
                }
              >

                <FaSignOutAlt />

                <span>
                  Logout
                </span>

              </button>


            </div>

          )}

        </div>


      </div>


    </header>

  );

}


export default AdminNavbar;