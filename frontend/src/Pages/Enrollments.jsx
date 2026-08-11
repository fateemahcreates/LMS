import { useEffect, useState } from "react";

import {
  FaUsers,
  FaBookReader,
  FaCheckCircle,
  FaCertificate,
  FaSearch,
} from "react-icons/fa";

import {
  getAllEnrollments,
  approveCertificate,
} from "../services/enrollmentService";

import { notify } from "../utils/notify";

import "../styles/Enrollments.css";

import EnrollmentDetailsDrawer from "../components/EnrollmentDetailsDrawer";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedEnrollment, setSelectedEnrollment] =
    useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // ==========================================
  // FETCH ENROLLMENTS
  // ==========================================

  const fetchEnrollments = async () => {
    try {
      const res = await getAllEnrollments();

      setEnrollments(res.data);
    } catch (error) {
      console.error(error);

      notify.apiError(error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // ==========================================
  // APPROVE CERTIFICATE
  // ==========================================

  const handleApprove = async (id) => {
    try {
      await approveCertificate(id);

      notify.success(
        "Certificate approved successfully."
      );

      fetchEnrollments();
    } catch (error) {
      console.error(error);

      notify.apiError(error);
    }
  };

  // ==========================================
  // VIEW ENROLLMENT
  // ==========================================

  const handleView = (enrollment) => {
    setSelectedEnrollment(enrollment);

    setDrawerOpen(true);
  };

  // ==========================================
  // FILTER ENROLLMENTS
  // ==========================================

  const filteredEnrollments = enrollments.filter(
    (item) => {
      const search = searchTerm.toLowerCase();

      const student =
        item.student?.name?.toLowerCase() || "";

      const course =
        item.course?.title?.toLowerCase() || "";

      const matchesSearch =
        student.includes(search) ||
        course.includes(search);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : item.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        item.student &&
        item.course
      );
    }
  );

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="gmt-enrollment-page">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="gmt-enrollment-header">

        <div className="gmt-enrollment-header-content">

          <span className="gmt-enrollment-header-tag">
            ENROLLMENT MANAGEMENT
          </span>

          <h1>
            Enrollment Management
          </h1>

          <p>
            Monitor student learning,
            course duration and
            certificate approvals.
          </p>

        </div>

        <div className="gmt-enrollment-header-icon">
          <FaBookReader />
        </div>

      </div>


      {/* ======================================
          SUMMARY STATS
      ====================================== */}

      <div className="gmt-enrollment-stats">

        {/* Total */}

        <div className="gmt-enrollment-stat-card">

          <div className="gmt-enrollment-stat-icon">
            <FaUsers />
          </div>

          <div className="gmt-enrollment-stat-content">

            <h2>
              {enrollments.length}
            </h2>

            <span>
              Total Enrollments
            </span>

          </div>

        </div>


        {/* Active */}

        <div className="gmt-enrollment-stat-card">

          <div className="gmt-enrollment-stat-icon">
            <FaBookReader />
          </div>

          <div className="gmt-enrollment-stat-content">

            <h2>
              {
                enrollments.filter(
                  (e) =>
                    e.status ===
                    "In Progress"
                ).length
              }
            </h2>

            <span>
              Active Learning
            </span>

          </div>

        </div>


        {/* Completed */}

        <div className="gmt-enrollment-stat-card">

          <div className="gmt-enrollment-stat-icon">
            <FaCheckCircle />
          </div>

          <div className="gmt-enrollment-stat-content">

            <h2>
              {
                enrollments.filter(
                  (e) =>
                    e.status ===
                    "Completed"
                ).length
              }
            </h2>

            <span>
              Completed
            </span>

          </div>

        </div>


        {/* Certificates */}

        <div className="gmt-enrollment-stat-card">

          <div className="gmt-enrollment-stat-icon">
            <FaCertificate />
          </div>

          <div className="gmt-enrollment-stat-content">

            <h2>
              {
                enrollments.filter(
                  (e) =>
                    e.certificateApproved
                ).length
              }
            </h2>

            <span>
              Certificates
            </span>

          </div>

        </div>

      </div>


      {/* ======================================
          SEARCH & FILTER
      ====================================== */}

      <div className="gmt-enrollment-toolbar">

        <div className="gmt-enrollment-search">

          <FaSearch className="gmt-enrollment-search-icon" />

          <input
            type="text"
            placeholder="Search student or course..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>


        <div className="gmt-enrollment-filter">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="All">
              All Statuses
            </option>

            <option value="Enrolled">
              Enrolled
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Withdrawn">
              Withdrawn
            </option>

          </select>

        </div>

      </div>


      {/* ======================================
          DESKTOP TABLE
      ====================================== */}

      <div className="gmt-enrollment-table-wrapper">

        <table className="gmt-enrollment-table">

          <thead>

            <tr>

              <th>
                Student
              </th>

              <th>
                Course
              </th>

              <th>
                Start
              </th>

              <th>
                End
              </th>

              <th>
                Duration
              </th>

              <th>
                Days Left
              </th>

              <th>
                Progress
              </th>

              <th>
                Status
              </th>

              <th>
                Certificate
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredEnrollments.length === 0 ? (

              <tr>

                <td
                  colSpan="10"
                  className="gmt-enrollment-empty-cell"
                >

                  <div className="gmt-enrollment-empty-state">

                    <FaBookReader className="gmt-enrollment-empty-icon" />

                    <h3>
                      No Enrollments Found
                    </h3>

                    <p>
                      No enrollment records
                      match your current
                      search or filter.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              filteredEnrollments.map(
                (item) => (

                  <tr key={item._id}>

                    {/* Student */}

                    <td>

                      <div className="gmt-enrollment-student">

                        <div className="gmt-enrollment-student-avatar">
                          <FaUsers />
                        </div>

                        <div>

                          <strong>
                            {item.student?.name}
                          </strong>

                          <span>
                            {item.student?.email}
                          </span>

                        </div>

                      </div>

                    </td>


                    {/* Course */}

                    <td>

                      <div className="gmt-enrollment-course">

                        <FaBookReader />

                        <span>
                          {item.course?.title}
                        </span>

                      </div>

                    </td>


                    {/* Start */}

                    <td>
                      {formatDate(
                        item.startDate
                      )}
                    </td>


                    {/* End */}

                    <td>
                      {formatDate(
                        item.endDate
                      )}
                    </td>


                    {/* Duration */}

                    <td>
                      {item.course?.duration}
                    </td>


                    {/* Days Left */}

                    <td>

                      <span className="gmt-enrollment-days-left">

                        {item.daysRemaining}

                        {" "}

                        days

                      </span>

                    </td>


                    {/* Progress */}

                    <td>

                      <div className="gmt-enrollment-progress-wrapper">

                        <div className="gmt-enrollment-progress-bar">

                          <div
                            className="gmt-enrollment-progress-fill"
                            style={{
                              width: `${item.progress}%`,
                            }}
                          />

                        </div>

                        <span>
                          {item.progress}%
                        </span>

                      </div>

                    </td>


                    {/* Status */}

                    <td>

                      <span
                        className={`gmt-enrollment-status ${
                          item.status
                            ?.toLowerCase()
                            .replace(/\s+/g, "-")
                        }`}
                      >

                        {item.status}

                      </span>

                    </td>


                    {/* Certificate */}

                    <td>

                      {item.certificateApproved ? (

                        <span className="gmt-enrollment-approved">

                          <FaCheckCircle />

                          Approved

                        </span>

                      ) : item.progress === 100 ? (

                        <button
                          className="gmt-enrollment-approve-btn"
                          onClick={() =>
                            handleApprove(
                              item._id
                            )
                          }
                        >

                          <FaCertificate />

                          Approve

                        </button>

                      ) : (

                        <span className="gmt-enrollment-pending">

                          Pending

                        </span>

                      )}

                    </td>


                    {/* Actions */}

                    <td>

                      <button
                        className="gmt-enrollment-view-btn"
                        onClick={() =>
                          handleView(item)
                        }
                      >

                        View

                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* ======================================
          MOBILE ENROLLMENTS
      ====================================== */}

      <div className="gmt-mobile-enrollments">

        {filteredEnrollments.length === 0 ? (

          <div className="gmt-enrollment-empty-state">

            <FaBookReader className="gmt-enrollment-empty-icon" />

            <h3>
              No Enrollments Found
            </h3>

            <p>
              No enrollment records match
              your current search or filter.
            </p>

          </div>

        ) : (

          filteredEnrollments.map(
            (item) => (

              <div
                className="gmt-enrollment-card"
                key={item._id}
              >

                {/* Card Header */}

                <div className="gmt-enrollment-card-header">

                  <div className="gmt-enrollment-student-avatar">
                    <FaUsers />
                  </div>

                  <div>

                    <h3>
                      {item.student?.name}
                    </h3>

                    <span>
                      {item.student?.email}
                    </span>

                  </div>

                </div>


                {/* Course */}

                <div className="gmt-enrollment-card-course">

                  <FaBookReader />

                  <span>
                    {item.course?.title}
                  </span>

                </div>


                {/* Details */}

                <div className="gmt-enrollment-card-details">

                  <p>
                    <strong>
                      Duration:
                    </strong>

                    {" "}

                    {item.course?.duration}
                  </p>

                  <p>
                    <strong>
                      Start:
                    </strong>

                    {" "}

                    {formatDate(
                      item.startDate
                    )}
                  </p>

                  <p>
                    <strong>
                      End:
                    </strong>

                    {" "}

                    {formatDate(
                      item.endDate
                    )}
                  </p>

                  <p>
                    <strong>
                      Days Left:
                    </strong>

                    {" "}

                    {item.daysRemaining}
                  </p>

                </div>


                {/* Status */}

                <div className="gmt-enrollment-card-status">

                  <strong>
                    Status
                  </strong>

                  <span
                    className={`gmt-enrollment-status ${
                      item.status
                        ?.toLowerCase()
                        .replace(/\s+/g, "-")
                    }`}
                  >
                    {item.status}
                  </span>

                </div>


                {/* Progress */}

                <div className="gmt-enrollment-card-progress">

                  <div className="gmt-enrollment-card-progress-header">

                    <strong>
                      Learning Progress
                    </strong>

                    <span>
                      {item.progress}%
                    </span>

                  </div>

                  <div className="gmt-enrollment-progress-bar">

                    <div
                      className="gmt-enrollment-progress-fill"
                      style={{
                        width: `${item.progress}%`,
                      }}
                    />

                  </div>

                </div>


                {/* Actions */}

                <div className="gmt-enrollment-card-actions">

                  {item.certificateApproved ? (

                    <span className="gmt-enrollment-approved">

                      <FaCheckCircle />

                      Approved

                    </span>

                  ) : item.progress === 100 ? (

                    <button
                      className="gmt-enrollment-approve-btn"
                      onClick={() =>
                        handleApprove(
                          item._id
                        )
                      }
                    >

                      <FaCertificate />

                      Approve

                    </button>

                  ) : (

                    <span className="gmt-enrollment-pending">

                      Pending

                    </span>

                  )}


                  <button
                    className="gmt-enrollment-view-btn"
                    onClick={() =>
                      handleView(item)
                    }
                  >

                    View Details

                  </button>

                </div>

              </div>

            )
          )

        )}

      </div>


      {/* ======================================
          ENROLLMENT DETAILS DRAWER
      ====================================== */}

      <EnrollmentDetailsDrawer
        open={drawerOpen}
        enrollment={selectedEnrollment}
        onClose={() =>
          setDrawerOpen(false)
        }
        handleApprove={handleApprove}
      />

    </main>
  );
}

export default Enrollments;