import "../../styles/StudentCourses.css";

import {
  FaBookOpen,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";

function StudentCourses() {
  // Temporary data
  // Later this will come from the backend
  const courses = [
    {
      id: 1,
      title: "Web Development",
      code: "CSC 401",
      instructor: "Dr. Michael Adams",
      progress: 78,
    },
    {
      id: 2,
      title: "Database Systems",
      code: "CSC 405",
      instructor: "Prof. Sarah Johnson",
      progress: 56,
    },
    {
      id: 3,
      title: "Software Engineering",
      code: "CSC 409",
      instructor: "Dr. David Wilson",
      progress: 91,
    },
  ];

  return (
    <section className="student-courses">

      <div className="courses-header">

        <div>
          <h2>My Courses</h2>
          <p>Your enrolled courses this semester</p>
        </div>

        <button className="view-all-btn">
          View All
          <FaArrowRight />
        </button>

      </div>

      <div className="courses-list">

        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
          >

            <div className="course-icon">
              <FaBookOpen />
            </div>

            <div className="course-content">

              <div className="course-top">

                <h3>{course.title}</h3>

                <span className="course-code">
                  {course.code}
                </span>

              </div>

              <p>{course.instructor}</p>

              <div className="progress-row">

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  />
                </div>

                <span>{course.progress}%</span>

              </div>

              <div className="course-footer">

                <div className="course-time">
                  <FaClock />
                  Ongoing
                </div>

                <button className="continue-btn">
                  Continue
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default StudentCourses;