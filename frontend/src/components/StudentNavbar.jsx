import "../styles/StudentNavbar.css";

import { FaBars, FaBell } from "react-icons/fa";

function StudentNavbar({ setSidebarOpen }) {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const currentHour = new Date().getHours();

  let greeting = "Good Evening";

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <header className="navbar">

      <div className="navbar-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>

        <div>
          <h2>{greeting}, {user.name || "Student"} 👋</h2>

          <p>Welcome back to your learning portal.</p>
        </div>

      </div>

      <div className="navbar-right">

        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        <div className="profile-info">

          <div className="avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "S"}
          </div>

          <div>

            <h4>{user.name || "Student"}</h4>

            <small>
              {user.role
                ? user.role.charAt(0).toUpperCase() +
                  user.role.slice(1)
                : "Student"}
            </small>

          </div>

        </div>

      </div>

    </header>
  );
}

export default StudentNavbar;