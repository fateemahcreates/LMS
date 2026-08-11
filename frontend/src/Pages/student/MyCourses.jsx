import { useEffect, useState } from "react";

import {
  getMyCourses,
} from "../../services/enrollmentService";

import "../../styles/MyCourses.css";

import {
  FaBookOpen,
  FaClock,
  FaUserTie,
  FaChartLine,
} from "react-icons/fa";


function MyCourses() {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);


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


      {/* ===============================
          PAGE HEADER
      =============================== */}

      <div className="my-courses-header">


        <span className="my-courses-tag">

          MY COURSES

        </span>


        <h1>

          Training Programs

        </h1>


        <p>

          Track your enrolled training programs,
          monitor your academic progress,
          and access important course information.

        </p>


      </div>



      {/* ===============================
          LOADING
      =============================== */}


      {loading ? (

        <div className="my-courses-loading">

          <h2>
            Loading your courses...
          </h2>

        </div>


      ) : courses.length === 0 ? (


        /* ===============================
           EMPTY STATE
        =============================== */


        <div className="my-courses-empty">


          <FaBookOpen className="empty-icon" />


          <h2>

            No Active Enrollments

          </h2>


          <p>

            You haven't been enrolled in any
            GMT Software Academy training
            programs yet.

          </p>


        </div>



      ) : (


        /* ===============================
           COURSE GRID
        =============================== */


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
                    "https://placehold.co/600x350?text=GMT+Software+Academy"
                  }

                  alt={course.title}

                />




                <div className="my-course-content">



                  <span className="my-course-category">

                    {course.category}

                  </span>




                  <h2>

                    {course.title}

                  </h2>





                  {/* COURSE META */}


                  <div className="my-course-meta">


                    <span>

                      <FaUserTie />

                      {course.instructor}

                    </span>



                    <span>

                      <FaClock />

                      {course.duration}

                    </span>


                  </div>






                  {/* PROGRESS */}


                  <div className="my-course-progress">


                    <div className="my-course-progress-header">


                      <span>

                        Academic Progress

                      </span>



                      <strong>

                        {enrollment.progress || 0}%

                      </strong>


                    </div>





                    <div className="my-course-progress-bar">


                      <div

                        className="my-course-progress-fill"

                        style={{
                          width: `${enrollment.progress || 0}%`,
                        }}

                      />

                    </div>


                  </div>






                  {/* STATUS */}


                  <div className="my-course-status">


                    <span

                      className={`my-course-status-badge ${
                        enrollment.status
                        ?.toLowerCase()
                        .replace(/\s/g, "-")
                      }`}

                    >

                      {enrollment.status}


                    </span>


                  </div>






                  {/* ACADEMY MESSAGE */}


                  <div className="my-course-action">


                    <FaChartLine />


                    <span>

                      Training Progress Updated by Academy

                    </span>


                  </div>






                  {/* CERTIFICATE */}


                  {enrollment.certificateApproved && (


                    <button

                      className="my-course-certificate"

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