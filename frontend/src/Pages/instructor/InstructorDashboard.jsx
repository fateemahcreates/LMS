import { useEffect, useState } from "react";

import {
  FaBookOpen,
  FaUsers,
  FaClipboardList,
  FaBullhorn,
  FaPlus,
  FaArrowRight,
  FaClock,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import logo from "../../assets/GMT Software logo.jpeg";

import {
  getInstructorDashboard,
  getInstructorCourses,
} from "../../services/instructorService";

import {
  getInstructorAssignments,
} from "../../services/assignmentService";

import {
  getAnnouncements,
} from "../../services/announcementService";

import "../../styles/InstructorDashboard.css";

function InstructorDashboard() {

  // ==========================================
  // USER
  // ==========================================

  const [user, setUser] = useState(null);

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
  });

  // ==========================================
  // ASSIGNMENTS
  // ==========================================

  const [assignments, setAssignments] = useState([]);

  // ==========================================
  // ANNOUNCEMENTS
  // ==========================================

  const [announcements, setAnnouncements] = useState([]);

  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);

        // ======================================
        // LOGGED IN USER
        // ======================================

        const loggedInUser =
          JSON.parse(
            localStorage.getItem("user")
          );

        setUser(loggedInUser);

        // ======================================
        // LOAD DASHBOARD
        // ======================================

        let dashboardData = {};

        try {

          const dashboardResponse =
            await getInstructorDashboard();

          dashboardData =
            dashboardResponse.data || {};

          console.log(
            "INSTRUCTOR DASHBOARD:",
            dashboardData
          );

        } catch (error) {

          console.error(
            "Dashboard API error:",
            error
          );

        }

        // ======================================
        // LOAD COURSES
        // ======================================

        let courseData = [];

        try {

          const courseResponse =
            await getInstructorCourses();

          courseData =
            Array.isArray(courseResponse.data)
              ? courseResponse.data
              : [];

          console.log(
            "INSTRUCTOR COURSES:",
            courseData
          );

        } catch (error) {

          console.error(
            "Instructor courses error:",
            error
          );

        }

        // ======================================
        // LOAD ASSIGNMENTS
        // ======================================

        let assignmentData = [];

        try {

          const assignmentResponse =
            await getInstructorAssignments();

          assignmentData =
            Array.isArray(
              assignmentResponse.data
            )
              ? assignmentResponse.data
              : [];

          console.log(
            "INSTRUCTOR ASSIGNMENTS:",
            assignmentData
          );

        } catch (error) {

          console.error(
            "Instructor assignments error:",
            error
          );

        }

        // ======================================
        // LOAD ANNOUNCEMENTS
        // ======================================

        let announcementData = [];

        try {

          const announcementResponse =
            await getAnnouncements();

          console.log(
            "ANNOUNCEMENTS RESPONSE:",
            announcementResponse.data
          );

          /*
            Depending on your backend controller,
            the response may be:

            []
            
            OR

            {
              announcements: []
            }

            OR

            {
              data: []
            }
          */

          if (
            Array.isArray(
              announcementResponse.data
            )
          ) {

            announcementData =
              announcementResponse.data;

          } else if (
            Array.isArray(
              announcementResponse.data
                ?.announcements
            )
          ) {

            announcementData =
              announcementResponse.data
                .announcements;

          } else if (
            Array.isArray(
              announcementResponse.data
                ?.data
            )
          ) {

            announcementData =
              announcementResponse.data.data;

          } else {

            announcementData = [];

          }

          console.log(
            "FINAL ANNOUNCEMENTS:",
            announcementData
          );

        } catch (error) {

          console.error(
            "Announcements API error:",
            error
          );

          announcementData = [];

        }

        // ======================================
        // UPDATE STATE
        // ======================================

        setStats({

          totalCourses:
            dashboardData.totalCourses ??
            courseData.length ??
            0,

          totalStudents:
            dashboardData.totalStudents ??
            0,

        });

        setAssignments(
          assignmentData
        );

        setAnnouncements(
          announcementData
        );

      } catch (error) {

        console.error(
          "Instructor dashboard error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);

  // ==========================================
  // RECENT ASSIGNMENTS
  // ==========================================

  const recentAssignments =
    [...assignments]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || b.updatedAt || 0
          ) -
          new Date(
            a.createdAt || a.updatedAt || 0
          )
      )
      .slice(0, 5);

  // ==========================================
  // RECENT ANNOUNCEMENTS
  // ==========================================

  const recentAnnouncements =
    [...announcements]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || b.updatedAt || 0
          ) -
          new Date(
            a.createdAt || a.updatedAt || 0
          )
      )
      .slice(0, 5);

  // ==========================================
  // REAL STATS
  // ==========================================

  const totalAssignments =
    assignments.length;

  const totalAnnouncements =
    announcements.length;

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    return new Date(date)
      .toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );

  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="instructor-dashboard">

        <div className="instructor-dashboard-loading">

          <FaBookOpen />

          <h2>
            Loading Instructor Dashboard...
          </h2>

          <p>
            Preparing your teaching overview.
          </p>

        </div>

      </div>

    );

  }

  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="instructor-dashboard">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="instructor-dashboard-hero">

        <div className="instructor-hero-left">

          <img
            src={logo}
            alt="GMT Software Academy"
            className="instructor-hero-logo"
          />

          <div className="instructor-hero-content">

            <h5>
              GMT SOFTWARE ACADEMY
            </h5>

            <h1>
              Welcome back,{" "}
              {user?.name || "Instructor"}
            </h1>

            <p>
              Manage your courses, students,
              assignments and announcements
              from one centralized instructor
              portal.
            </p>

          </div>

        </div>

        <div className="instructor-hero-right">

          <Link
            to="/instructor/courses"
            className="instructor-hero-btn"
          >
            <FaBookOpen />

            My Courses

          </Link>

        </div>

      </section>


      {/* =====================================
          STATISTICS
      ====================================== */}

      <section className="instructor-dashboard-stats">

        {/* COURSES */}

        <div className="instructor-stat-card">

          <div className="instructor-stat-icon">
            <FaBookOpen />
          </div>

          <div className="instructor-stat-info">

            <span>
              My Courses
            </span>

            <h2>
              {stats.totalCourses}
            </h2>

          </div>

        </div>


        {/* STUDENTS */}

        <div className="instructor-stat-card">

          <div className="instructor-stat-icon">
            <FaUsers />
          </div>

          <div className="instructor-stat-info">

            <span>
              Total Students
            </span>

            <h2>
              {stats.totalStudents}
            </h2>

          </div>

        </div>


        {/* ASSIGNMENTS */}

        <div className="instructor-stat-card">

          <div className="instructor-stat-icon">
            <FaClipboardList />
          </div>

          <div className="instructor-stat-info">

            <span>
              Assignments
            </span>

            <h2>
              {totalAssignments}
            </h2>

          </div>

        </div>


        {/* ANNOUNCEMENTS */}

        <div className="instructor-stat-card">

          <div className="instructor-stat-icon">
            <FaBullhorn />
          </div>

          <div className="instructor-stat-info">

            <span>
              Announcements
            </span>

            <h2>
              {totalAnnouncements}
            </h2>

          </div>

        </div>

      </section>


      {/* =====================================
          CONTENT GRID
      ====================================== */}

      <section className="instructor-dashboard-grid">


        {/* ===================================
            RECENT ASSIGNMENTS
        ==================================== */}

        <div className="instructor-dashboard-card instructor-large-card">

          <div className="instructor-card-header">

            <div>

              <h2>
                Recent Assignments
              </h2>

              <p>
                Your latest course assignments.
              </p>

            </div>

            <Link
              to="/instructor/assignments"
            >
              View All
            </Link>

          </div>


          {recentAssignments.length === 0 ? (

            <div className="instructor-empty-state">

              <FaClipboardList />

              <h3>
                No Assignments Yet
              </h3>

              <p>
                Create an assignment to
                start tracking student work.
              </p>

              <Link
                to="/instructor/assignments"
                className="instructor-empty-action"
              >
                <FaPlus />

                Create Assignment

              </Link>

            </div>

          ) : (

            <div className="instructor-recent-list">

              {recentAssignments.map(
                (assignment) => (

                  <div
                    key={assignment._id}
                    className="instructor-recent-item"
                  >

                    <div className="instructor-recent-icon">
                      <FaClipboardList />
                    </div>

                    <div className="instructor-recent-info">

                      <strong>
                        {assignment.title ||
                          "Untitled Assignment"}
                      </strong>

                      <span>
                        {assignment.course?.title ||
                          "Course"}
                      </span>

                    </div>

                    <div className="instructor-recent-meta">

                      <span>
                        <FaCalendarAlt />

                        {formatDate(
                          assignment.dueDate
                        )}

                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* ===================================
            SIDE PANEL
        ==================================== */}

        <div className="instructor-side-panel">


          {/* QUICK ACTIONS */}

          <div className="instructor-dashboard-card">

            <div className="instructor-card-header">

              <h2>
                Quick Actions
              </h2>

            </div>


            <div className="instructor-quick-actions">

              <Link
                to="/instructor/create-course"
                className="instructor-quick-action-btn"
              >

                <FaPlus />

                Create Course

              </Link>


              <Link
                to="/instructor/assignments"
                className="instructor-quick-action-btn"
              >

                <FaClipboardList />

                New Assignment

              </Link>


              <Link
                to="/instructor/announcements"
                className="instructor-quick-action-btn"
              >

                <FaBullhorn />

                Announcement

              </Link>

            </div>

          </div>


          {/* RECENT ACTIVITY */}

          <div className="instructor-dashboard-card">

            <div className="instructor-card-header">

              <h2>
                Recent Activity
              </h2>

            </div>

            <div className="instructor-activity-item">

              <div className="instructor-activity-dot">
              </div>

              <div>

                <strong>
                  Teaching Overview
                </strong>

                <p>
                  You currently have{" "}
                  {totalAssignments}{" "}
                  assignment
                  {totalAssignments !== 1 &&
                    "s"}{" "}
                  and{" "}
                  {totalAnnouncements}{" "}
                  announcement
                  {totalAnnouncements !== 1 &&
                    "s"}.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          LATEST ANNOUNCEMENTS
      ====================================== */}

      <section className="instructor-dashboard-card instructor-dashboard-announcements">

        <div className="instructor-card-header">

          <div>

            <h2>
              Latest Announcements
            </h2>

            <p>
              Recent announcements published
              in the academy.
            </p>

          </div>

          <Link
            to="/instructor/announcements"
          >
            View All
          </Link>

        </div>


        {recentAnnouncements.length === 0 ? (

          <div className="instructor-empty-state">

            <FaBullhorn />

            <h3>
              No Announcements
            </h3>

            <p>
              Your announcements will appear
              here once they are created.
            </p>

            <Link
              to="/instructor/announcements"
              className="instructor-empty-action"
            >

              <FaPlus />

              Create Announcement

            </Link>

          </div>

        ) : (

          <div className="instructor-announcement-list">

            {recentAnnouncements.map(
              (announcement) => (

                <div
                  key={announcement._id}
                  className="instructor-announcement-item"
                >

                  <div className="instructor-announcement-icon">

                    <FaBullhorn />

                  </div>

                  <div className="instructor-announcement-content">

                    <div>

                      <h3>
                        {announcement.title ||
                          announcement.subject ||
                          "Announcement"}
                      </h3>

                      <span>
                        {formatDate(
                          announcement.createdAt
                        )}
                      </span>

                    </div>

                    <p>
                      {announcement.message ||
                        announcement.content ||
                        announcement.description ||
                        "No announcement content."}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* =====================================
          FOOTER
      ====================================== */}

      <footer className="instructor-dashboard-footer">

        <p>
          © {new Date().getFullYear()}
          GMT Software Academy
        </p>

      </footer>

    </div>

  );

}

export default InstructorDashboard;