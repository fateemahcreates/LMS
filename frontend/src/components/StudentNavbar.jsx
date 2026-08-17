import { useEffect, useState } from "react";

import "../styles/StudentNavbar.css";

import logo from "../assets/GMT Software logo.jpeg";

import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notify";

import {
  FaBars,
  FaBell,
  FaSearch,
  FaChevronDown,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import NotificationDropdown from "./NotificationDropdown";

import api from "../services/api";


function StudentNavbar({
  setSidebarOpen,
}) {

  const navigate = useNavigate();


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


  // ============================================================
  // GREETING
  // ============================================================

  const currentHour =
    new Date().getHours();

  let greeting = "Good Evening";

  if (currentHour < 12) {

    greeting = "Good Morning";

  } else if (currentHour < 18) {

    greeting = "Good Afternoon";

  }


  // ============================================================
  // FETCH UNREAD NOTIFICATION COUNT
  // ============================================================

  const fetchUnreadCount = async () => {

    try {

      const response =
        await api.get(
          "/notifications/unread-count"
        );

      const count =
        Number(
          response.data?.count || 0
        );

      setUnreadCount(
        count
      );

    } catch (error) {

      console.error(
        "Failed to load unread notification count:",
        error
      );

    }

  };


  // ============================================================
  // LOAD NOTIFICATION COUNT
  // ============================================================

  useEffect(() => {

    fetchUnreadCount();


    // ==========================================
    // CHECK FOR NEW NOTIFICATIONS
    // EVERY 30 SECONDS
    // ==========================================

    const notificationInterval =
      setInterval(() => {

        fetchUnreadCount();

      }, 30000);


    return () => {

      clearInterval(
        notificationInterval
      );

    };

  }, []);


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {

    notify.confirmLogout(() => {

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      navigate("/login");

    });

  };


  // ============================================================
  // OPEN SETTINGS
  // ============================================================

  const openSettings = (section) => {

    setProfileOpen(false);

    setNotificationOpen(false);

    navigate(
      `/student-settings?section=${section}`
    );

  };


  // ============================================================
  // PROFILE DROPDOWN
  // ============================================================

  const toggleProfile = () => {

    setProfileOpen(
      (previous) => !previous
    );

    setNotificationOpen(false);

  };


  // ============================================================
  // NOTIFICATION DROPDOWN
  // ============================================================

  const toggleNotifications = () => {

    setNotificationOpen(
      (previous) => !previous
    );

    setProfileOpen(false);

  };


  // ============================================================
  // CLOSE NOTIFICATIONS
  // ============================================================

  const handleNotificationClose = () => {

    setNotificationOpen(false);

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <header className="student-navbar">


      {/* =====================================================
          LEFT SECTION
      ===================================================== */}

      <div className="student-navbar-left">


        {/* SIDEBAR MENU */}

        <button
          type="button"
          className="student-navbar-menu"
          onClick={() =>
            setSidebarOpen(true)
          }
          aria-label="Open sidebar"
        >

          <FaBars />

        </button>


        {/* BRAND */}

        <div className="student-navbar-brand">


          <img
            src={logo}
            alt="GMT Software Academy"
            className="student-navbar-logo"
          />


          <div className="student-navbar-brand-text">

            <h3>
              GMT Software Academy
            </h3>

            <span>
              Student Portal
            </span>

          </div>


        </div>


      </div>


      {/* =====================================================
          CENTER GREETING
      ===================================================== */}

      <div className="student-navbar-center">

        <div className="student-navbar-greeting">

          <h2>

            {greeting},{" "}

            <span>
              {user.name || "Student"}
            </span>

          </h2>

        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="student-navbar-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search courses, assignments..."
        />

      </div>


      {/* =====================================================
          RIGHT SECTION
      ===================================================== */}

      <div className="student-navbar-right">


        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}

        <div className="student-navbar-notification-wrapper">


          <button
            type="button"
            className={
              notificationOpen
                ? "student-navbar-notification active"
                : "student-navbar-notification"
            }
            onClick={toggleNotifications}
            aria-label={
              unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "Notifications"
            }
            title={
              unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "Notifications"
            }
          >

            <FaBell />


            {/* ==============================================
                UNREAD NOTIFICATION COUNT
            ============================================== */}

            {unreadCount > 0 && (

              <span
                className="student-navbar-notification-badge"
              >

                {unreadCount > 99
                  ? "99+"
                  : unreadCount}

              </span>

            )}

          </button>


          {/* ==============================================
              NOTIFICATION DROPDOWN
          ============================================== */}

          {notificationOpen && (

            <NotificationDropdown

              onClose={
                handleNotificationClose
              }

              onUnreadCountChange={
                setUnreadCount
              }

            />

          )}

        </div>


        {/* ===================================================
            PROFILE
        =================================================== */}

        <div className="student-navbar-profile-container">


          <button
            type="button"
            className="student-navbar-profile-btn"
            onClick={toggleProfile}
            aria-label="Open profile menu"
          >


            {/* AVATAR */}

            <div className="student-navbar-avatar">

              {
                user.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "S"
              }

            </div>


            {/* USER INFO */}

            <div className="student-navbar-user">

              <h4>
                {user.name || "Student"}
              </h4>

              <small>
                Student
              </small>

            </div>


            <FaChevronDown />

          </button>


          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {profileOpen && (

            <div className="student-navbar-dropdown">


              {/* HEADER */}

              <div className="student-navbar-dropdown-header">


                <div className="student-navbar-dropdown-avatar">

                  <FaUserCircle />

                </div>


                <div>

                  <h3>
                    {user.name || "Student"}
                  </h3>

                  <p>
                    {user.email ||
                      "student@email.com"}
                  </p>

                </div>


              </div>


              <div className="student-navbar-dropdown-divider" />


              {/* PROFILE */}

              <button
                type="button"
                onClick={() =>
                  openSettings("profile")
                }
              >

                <FaUserCircle />

                <span>
                  Profile
                </span>

              </button>


              {/* NOTIFICATIONS */}

              <button
                type="button"
                onClick={() =>
                  openSettings("notifications")
                }
              >

                <FaBell />

                <span>
                  Notifications
                </span>

              </button>


              {/* SETTINGS */}

              <button
                type="button"
                onClick={() =>
                  openSettings("account")
                }
              >

                <FaCog />

                <span>
                  Settings
                </span>

              </button>


              <div className="student-navbar-dropdown-divider" />


              {/* LOGOUT */}

              <button
                type="button"
                className="student-navbar-logout"
                onClick={handleLogout}
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


export default StudentNavbar;