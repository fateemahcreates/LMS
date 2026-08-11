import { useEffect, useMemo, useState } from "react";

import {
  FaUsers,
  FaUserCheck,
  FaGraduationCap,
  FaChartLine,
  FaSearch,
  FaEye,
} from "react-icons/fa";

import { notify } from "../../utils/notify";
import { getInstructorStudents } from "../../services/instructorService";

import "../../styles/InstructorStudents.css";
import InstructorStudentDrawer from "../../components/instructor/InstructorStudentDrawer";


function InstructorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await getInstructorStudents();
      setStudents(res.data);
    } catch (error) {
      console.log(error);
      notify.error("Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const student = item.student || {};

      return (
        student.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        student.email
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [students, search]);

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (s) => s.status === "In Progress"
  ).length;

  const completedStudents = students.filter(
    (s) => s.status === "Completed"
  ).length;

  const averageProgress =
    students.length > 0
      ? Math.round(
          students.reduce(
            (sum, s) => sum + (s.progress || 0),
            0
          ) / students.length
        )
      : 0;

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "completed";

      case "In Progress":
        return "in-progress";

      case "Withdrawn":
        return "withdrawn";

      default:
        return "enrolled";
    }
  };

  if (loading) {
    return (
      <main className="gmt-instructor-students-page">

        <div className="gmt-instructor-students-loading">
          Loading Students...
        </div>

      </main>
    );
  }

  return (
    <main className="gmt-instructor-students-page">

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div className="gmt-instructor-students-header">

        <div>

          <h1>My Students</h1>

          <p>
            Students enrolled in your courses.
          </p>

        </div>

      </div>

      {/* ============================= */}
      {/* STATISTICS */}
      {/* ============================= */}

      <div className="gmt-instructor-students-stats">

        <div className="gmt-instructor-students-stat-card">

          <FaUsers />

          <h2>{totalStudents}</h2>

          <span>Total Students</span>

        </div>

        <div className="gmt-instructor-students-stat-card">

          <FaUserCheck />

          <h2>{activeStudents}</h2>

          <span>Active Students</span>

        </div>

        <div className="gmt-instructor-students-stat-card">

          <FaGraduationCap />

          <h2>{completedStudents}</h2>

          <span>Completed</span>

        </div>

        <div className="gmt-instructor-students-stat-card">

          <FaChartLine />

          <h2>{averageProgress}%</h2>

          <span>Average Progress</span>

        </div>

      </div>

      {/* ============================= */}
      {/* SEARCH */}
      {/* ============================= */}

      <div className="gmt-instructor-students-toolbar">

        <div className="gmt-instructor-students-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* ============================= */}
      {/* TABLE */}
      {/* ============================= */}

     {/* ============================= */}
{/* DESKTOP TABLE */}
{/* ============================= */}

<div className="gmt-instructor-students-table-wrapper">

  <table className="gmt-instructor-students-table">

    <thead>
      <tr>
        <th>Student</th>
        <th>Course</th>
        <th>Progress</th>
        <th>Final Score</th>
        <th>Status</th>
        <th>Last Activity</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>

      {filteredStudents.length > 0 ? (

        filteredStudents.map((item) => (

          <tr key={item._id}>

            {/* STUDENT */}

            <td>

              <div className="gmt-instructor-students-user">

                <div className="gmt-instructor-students-avatar">

                  {item.student?.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

                <div>

                  <strong>
                    {item.student?.name}
                  </strong>

                  <p>
                    {item.student?.email}
                  </p>

                </div>

              </div>

            </td>


            {/* COURSE */}

            <td>

              <strong>
                {item.course?.title}
              </strong>

              <p>
                {item.course?.code}
              </p>

            </td>


            {/* PROGRESS */}

            <td>

              <div className="gmt-instructor-students-progress">

                <div className="gmt-instructor-students-progress-bar">

                  <div
                    className="gmt-instructor-students-progress-fill"
                    style={{
                      width: `${item.progress || 0}%`,
                    }}
                  />

                </div>

                <span>
                  {item.progress || 0}%
                </span>

              </div>

            </td>


            {/* FINAL SCORE */}

            <td>

              {item.finalScore || 0}%

            </td>


            {/* STATUS */}

            <td>

              <span
                className={`gmt-instructor-students-status ${getStatusClass(
                  item.status
                )}`}
              >
                {item.status}
              </span>

            </td>


            {/* LAST ACTIVITY */}

            <td>

              {item.lastActivity
                ? new Date(
                    item.lastActivity
                  ).toLocaleDateString()
                : "—"}

            </td>


            {/* ACTION */}

            <td>

              <button
                className="gmt-instructor-students-view-btn"
                onClick={() => {
                  setSelectedStudent(item);
                  setDrawerOpen(true);
                }}
              >

                <FaEye />

                View

              </button>

            </td>

          </tr>

        ))

      ) : (

        <tr>

          <td colSpan="7">

            <div className="gmt-instructor-students-empty">

              No students found.

            </div>

          </td>

        </tr>

      )}

    </tbody>

  </table>

</div>


{/* ============================= */}
{/* MOBILE STUDENT CARDS */}
{/* ============================= */}

<div className="gmt-instructor-students-mobile">

  {filteredStudents.length > 0 ? (

    filteredStudents.map((item) => (

      <div
        className="gmt-instructor-student-card"
        key={item._id}
      >

        {/* =========================
            CARD HEADER
        ========================= */}

        <div className="gmt-instructor-student-card-header">

          <div className="gmt-instructor-students-user">

            <div className="gmt-instructor-students-avatar">

              {item.student?.name
                ?.charAt(0)
                .toUpperCase()}

            </div>

            <div>

              <strong>
                {item.student?.name}
              </strong>

              <p>
                {item.student?.email}
              </p>

            </div>

          </div>

        </div>


        {/* =========================
            COURSE
        ========================= */}

        <div className="gmt-instructor-student-card-course">

          <span>
            Course
          </span>

          <strong>
            {item.course?.title || "No course"}
          </strong>

          <small>
            {item.course?.code || ""}
          </small>

        </div>


        {/* =========================
            PROGRESS
        ========================= */}

        <div className="gmt-instructor-student-card-progress">

          <div className="gmt-instructor-student-card-label">

            <span>
              Progress
            </span>

            <strong>
              {item.progress || 0}%
            </strong>

          </div>


          <div className="gmt-instructor-students-progress-bar">

            <div
              className="gmt-instructor-students-progress-fill"
              style={{
                width: `${item.progress || 0}%`,
              }}
            />

          </div>

        </div>


        {/* =========================
            INFORMATION GRID
        ========================= */}

        <div className="gmt-instructor-student-card-info">

          <div>

            <span>
              Final Score
            </span>

            <strong>
              {item.finalScore || 0}%
            </strong>

          </div>


          <div>

            <span>
              Status
            </span>

            <span
              className={`gmt-instructor-students-status ${getStatusClass(
                item.status
              )}`}
            >
              {item.status}
            </span>

          </div>


          <div>

            <span>
              Last Activity
            </span>

            <strong>

              {item.lastActivity
                ? new Date(
                    item.lastActivity
                  ).toLocaleDateString()
                : "—"}

            </strong>

          </div>

        </div>


        {/* =========================
            ACTION
        ========================= */}

        <button
          className="gmt-instructor-student-card-view"
          onClick={() => {
            setSelectedStudent(item);
            setDrawerOpen(true);
          }}
        >

          <FaEye />

          View Student

        </button>

      </div>

    ))

  ) : (

    <div className="gmt-instructor-students-empty">

      No students found.

    </div>

  )}

</div>

      <InstructorStudentDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  studentData={selectedStudent}
/>

    </main>
  );
}

export default InstructorStudents;