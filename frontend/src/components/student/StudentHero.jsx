import "../../styles/StudentHero.css";

import {
  FaGraduationCap,
  FaBookOpen,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";

function StudentHero({ student }) {
  const user = student?.user || {};

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="student-hero">
      <div className="hero-content">
        {/* Left */}
        <div className="hero-left">
          <span className="hero-badge">
            Student Portal
          </span>

          <h1>
  {greeting},{" "}
  <span>
    {user?.name
      ? user.name.split(" ")[0]
      : "Student"}
  </span>{" "}
  👋
</h1>
          <p>
            Welcome back! Here's an overview of your
            academic journey today.
          </p>

          <div className="hero-meta">

  <div className="hero-meta-item">
    <FaCalendarAlt />
    <span>{today}</span>
  </div>

  <div className="hero-meta-item">
    <FaGraduationCap />
    <span>
      {student?.learningTrack || "Learning Track"}
    </span>
  </div>

  <div className="hero-meta-item">
    <FaIdCard />
    <span>
      {student?.studentId || "Student ID"}
    </span>
  </div>

</div>
        </div>

        {/* Right */}
        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-icon">
              <FaBookOpen />
            </div>

            <h3>
  {student?.currentCourse || "No Course Yet"}
</h3>

<p>
  {student?.courseDuration || "Course Duration"}
</p>

<small>
  Status:{" "}
  <strong>
    {student?.status || "Active"}
  </strong>
</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentHero;