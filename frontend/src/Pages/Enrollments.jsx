import { useEffect, useState } from "react";
import { getAllEnrollments } from "../services/enrollmentService";
import {approveCertificate,} from "../services/enrollmentService";
import {
  FaUsers,
  FaBookReader,
  FaCheckCircle,
  FaCertificate,
} from "react-icons/fa";

import "../styles/Enrollments.css";

function Enrollments() {

  const [searchTerm, setSearchTerm] = useState("");

const [statusFilter, setStatusFilter] = useState("All");
  const [enrollments, setEnrollments] = useState([]);

  const handleApprove = async (id) => {
  try {

    await approveCertificate(id);

    fetchEnrollments();

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to approve certificate."
    );
  }
};

  const fetchEnrollments = async () => {
    try {
      const res = await getAllEnrollments();

      setEnrollments(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filteredEnrollments =
  enrollments.filter((enrollment) => {

    const matchesSearch =

      enrollment.student.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      enrollment.course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =

      statusFilter === "All"

        ? true

        : enrollment.status === statusFilter;

    return matchesSearch && matchesStatus;

  });

  return (

    <main className="enrollments-page">

      <div className="page-header">

        <div className="summary-grid">

  <div className="summary-card">

    <div className="summary-icon blue">
      <FaUsers />
    </div>

    <div>

      <h2>{enrollments.length}</h2>

      <p>Total Enrollments</p>

    </div>

  </div>

  <div className="summary-card">

    <div className="summary-icon orange">
      <FaBookReader />
    </div>

    <div>

      <h2>
        {
          enrollments.filter(
            e => e.status === "In Progress"
          ).length
        }
      </h2>

      <p>Active Learning</p>

    </div>

  </div>

  <div className="summary-card">

    <div className="summary-icon green">
      <FaCheckCircle />
    </div>

    <div>

      <h2>
        {
          enrollments.filter(
            e => e.status === "Completed"
          ).length
        }
      </h2>

      <p>Completed Courses</p>

    </div>

  </div>

  <div className="summary-card">

    <div className="summary-icon purple">
      <FaCertificate />
    </div>

    <div>

      <h2>
        {
          enrollments.filter(
            e => e.certificateApproved
          ).length
        }
      </h2>

      <p>Certificates</p>

    </div>

  </div>

</div>
<div className="table-toolbar">

  <input
    type="text"
    placeholder="Search student or course..."
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
  >
    <option>All</option>

    <option>Enrolled</option>

    <option>In Progress</option>

    <option>Completed</option>

  </select>

</div>

        <h1>Enrollments</h1>

        <p>
          Monitor every student's learning progress.
        </p>

      </div>

      <table>

        <thead>

          <tr>

            <th>Student</th>

            <th>Course</th>

            <th>Progress</th>

            <th>Status</th>

            <th>Certificate</th>

          </tr>

        </thead>

        <tbody>

          {filteredEnrollments.map((item) => (

            <tr key={item._id}>

              <td>{item.student.name}</td>

              <td>{item.course.title}</td>

              <td>{item.progress}%</td>

              <td>{item.status}</td>

              <td>

  {item.certificateApproved ? (

    <span className="approved">
      Approved
    </span>

  ) : item.progress === 100 ? (

    <button
      className="approve-btn"
      onClick={() =>
        handleApprove(item._id)
      }
    >
      Approve
    </button>

  ) : (

    <span className="pending">
      Pending
    </span>

  )}

</td>
            </tr>

          ))}

        </tbody>

      </table>

    </main>

  );
}

export default Enrollments;