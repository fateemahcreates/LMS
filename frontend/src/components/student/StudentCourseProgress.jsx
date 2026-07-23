import "../../styles/StudentCourseProgress.css";

function StudentCourseProgress() {
  return (
    <div className="course-progress-card">

      <div className="section-title">
        <h2>Course Progress</h2>
        <span>Current Learning</span>
      </div>

      <div className="progress-course">

        <div className="course-info">
          <h3>React Fundamentals</h3>
          <span>80% Complete</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "80%" }}
          ></div>
        </div>

      </div>

      <div className="progress-course">

        <div className="course-info">
          <h3>Node.js Backend</h3>
          <span>45% Complete</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "45%" }}
          ></div>
        </div>

      </div>

      <div className="progress-course">

        <div className="course-info">
          <h3>MongoDB</h3>
          <span>20% Complete</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: "20%" }}
          ></div>
        </div>

      </div>

    </div>
  );
}

export default StudentCourseProgress;