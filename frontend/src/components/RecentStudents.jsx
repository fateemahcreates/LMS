import { FaUserGraduate } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

import "../styles/RecentStudents.css";

function RecentStudents({ students = [] }) {

  const recentStudents =
    students
      .slice(-5)
      .reverse();


  return (

    <div className="gmt-recent-students">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="gmt-recent-students-header">

        <div>

          <span className="gmt-recent-students-tag">
            RECENT STUDENTS
          </span>

          <h2>
            Latest Registrations
          </h2>

          <p>
            Recently registered students
            across GMT LMS.
          </p>

        </div>


        <div className="gmt-recent-students-total">

          {String(
            recentStudents.length
          ).padStart(2, "0")}

        </div>

      </div>



      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {recentStudents.length === 0 ? (

        <div className="gmt-recent-students-empty">

          <div className="gmt-recent-students-empty-icon">

            <FaUserGraduate />

          </div>


          <h3>
            No Students Found
          </h3>


          <p>
            Newly registered students will
            appear here.
          </p>

        </div>

      ) : (


        /* ===================================================
            STUDENT LIST
        =================================================== */

        <div className="gmt-recent-students-list">


          {recentStudents.map((student) => (

            <div
              className="gmt-recent-student-item"
              key={student._id}
            >


              {/* =============================================
                  AVATAR
              ============================================= */}

              <div className="gmt-recent-student-avatar">

                {student.user?.name
                  ?.charAt(0)
                  .toUpperCase() || "?"}

              </div>



              {/* =============================================
                  CONTENT
              ============================================= */}

              <div className="gmt-recent-student-content">


                {/* TOP */}

                <div className="gmt-recent-student-top">

                  <h4>

                    {student.user?.name ||
                      "Unknown Student"}

                  </h4>


                  <span
                    className={`gmt-recent-student-status ${
                      student.status ||
                      "active"
                    }`}
                  >

                    <span className="gmt-recent-student-status-dot"></span>

                    {student.status ||
                      "Active"}

                  </span>

                </div>



                {/* STUDENT ID */}

                <div className="gmt-recent-student-id">

                  <small>
                    ID
                  </small>

                  <h5>
                    {student.studentId ||
                      "N/A"}
                  </h5>

                </div>



                {/* META */}

                <div className="gmt-recent-student-meta">

                  <span>
                    {student.department ||
                      "Department not specified"}
                  </span>


                  <span className="gmt-recent-student-divider">
                    •
                  </span>


                  <span>
                    Level {student.level || "N/A"}
                  </span>

                </div>


              </div>



              {/* =============================================
                  ACTION
              ============================================= */}

              <button
                type="button"
                className="gmt-recent-student-action"
                aria-label={`View ${
                  student.user?.name ||
                  "student"
                }`}
              >

                <FiArrowUpRight />

              </button>


            </div>

          ))}


        </div>

      )}


    </div>

  );

}


export default RecentStudents;