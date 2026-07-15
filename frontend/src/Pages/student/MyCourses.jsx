import { useEffect, useState } from "react";
import { getMyCourses } from "../../services/enrollmentService";
import { continueLearning,} from "../../services/enrollmentService";

import "../../styles/MyCourses.css";

import {
  FaBookOpen,
  FaClock,
  FaUserTie,
  FaPlay,
} from "react-icons/fa";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleContinue = async (id) => {

    try{

        await continueLearning(id);

        fetchMyCourses();

    }

    catch(error){

        console.log(error);

    }

};

  const fetchMyCourses = async () => {
    try {
      const res = await getMyCourses();
      setCourses(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  return (
    <main className="my-courses">

      <div className="page-header">
        <h1>My Courses</h1>

        <p>
          Continue your learning journey and monitor
          your course progress.
        </p>
      </div>

      {loading ? (
        <div className="loading">
          <h2>Loading your courses...</h2>
        </div>
      ) : courses.length === 0 ? (
        <div className="empty-state">

          <FaBookOpen className="empty-icon" />

          <h2>No Courses Yet</h2>

          <p>
            You haven't enrolled in any courses.
          </p>

        </div>
      ) : (
        <div className="my-course-grid">

          {courses.map((enrollment) => {

            const course = enrollment.course;

            return (
              <div
                className="my-course-card"
                key={enrollment._id}
              >

                <img
                  src={
                    course.thumbnail ||
                    "https://placehold.co/600x350?text=Course"
                  }
                  alt={course.title}
                />

                <div className="my-course-content">

                  <span className="category">
                    {course.category}
                  </span>

                  <h2>{course.title}</h2>

                  <div className="course-meta">

                    <span>
                      <FaUserTie />
                      {course.instructor}
                    </span>

                    <span>
                      <FaClock />
                      {course.duration}
                    </span>

                  </div>

                  <div className="progress-section">

                    <div className="progress-header">

                      <span>Progress</span>

                      <span>
                        {enrollment.progress || 0}%
                      </span>

                    </div>

                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            enrollment.progress || 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="status-row">

                    <span className="status">
                      {enrollment.status}
                    </span>

                  </div>

                 <button
                className="continue-btn"
                 onClick={() =>
               handleContinue(enrollment._id)
                 }
                 >
                    <FaPlay />

                    Continue Learning

                  </button>

                  {enrollment.certificateApproved && (

                  <button
                className="certificate-btn"
                      >
                   Download Certificate
                     </button>

                       )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </main>
  );
}

export default MyCourses;