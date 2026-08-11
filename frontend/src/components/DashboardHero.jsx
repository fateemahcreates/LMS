import "../styles/DashboardHero.css";
import logo from "../assets/GMT Software logo.jpeg";

import { useNavigate } from "react-router-dom";

import {
  FaPlus,
  FaGraduationCap,
  FaBookOpen,
  FaCheckCircle,
} from "react-icons/fa";

function DashboardHero({
  students,
  courses,
  role,
}) {
  const navigate = useNavigate();

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const userName = user.name || "User";

  const isAdmin = role === "admin";

  return (
    <section className="dashboard-hero">

      {/* LEFT */}

      <div className="dashboard-hero-left">

        <span className="dashboard-hero-badge">
          GMT SOFTWARE ACADEMY
        </span>

        <p className="dashboard-greeting">
          {greeting}, {userName}
        </p>

        <h1>

          {isAdmin
            ? "Academic Management Command Center"
            : "Instructor Teaching Dashboard"}

        </h1>

        <p className="dashboard-description">

          {isAdmin
            ? "Manage courses, students, instructors, announcements, assignments and institutional performance from one intelligent dashboard."
            : "Manage your courses, assignments and teaching activities from one professional workspace."}

        </p>

        <div className="dashboard-actions">

          <button
            className="hero-primary-btn"
            onClick={() => navigate("/courses")}
          >
            <FaPlus />

            {isAdmin
              ? "Create Course"
              : "My Courses"}

          </button>

        </div>

      </div>

      {/* RIGHT */}

      <div className="dashboard-hero-right">

        <div className="dashboard-logo-card">

          <img
            src={logo}
            alt="GMT Software Academy"
          />

          <h3>GMT Software Academy</h3>

          <p>
            Learning Management System
          </p>

        </div>

        {/* CARD 1 */}

        <div className="floating-card floating-one">

          <FaGraduationCap />

          <div>

            <strong>
              {isAdmin
                ? students?.length || 0
                : courses?.length || 0}
            </strong>

            <small>

              {isAdmin
                ? "Registered Students"
                : "My Courses"}

            </small>

          </div>

        </div>

        {/* CARD 2 */}

        <div className="floating-card floating-two">

          <FaBookOpen />

          <div>

            <strong>
              {courses?.length || 0}
            </strong>

            <small>

              {isAdmin
                ? "Published Courses"
                : "Active Courses"}

            </small>

          </div>

        </div>

        {/* CARD 3 */}

        <div className="floating-card floating-three">

          <FaCheckCircle />

          <div>

            <strong>System Online</strong>

            <small>
              All Services Running
            </small>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardHero;