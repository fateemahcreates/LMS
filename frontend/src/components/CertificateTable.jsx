import { useEffect, useState } from "react";

import {
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
  FaCertificate,
} from "react-icons/fa";

import {
  getCertificates,
  approveCertificate,
  rejectCertificate,
} from "../services/certificateService";

import "../styles/CertificateTable.css";

function CertificateTable({ refresh }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD CERTIFICATES
  // ==========================================

  useEffect(() => {
    loadCertificates();
  }, [refresh]);

  const loadCertificates = async () => {
    try {
      setLoading(true);

      const res = await getCertificates();

      setCertificates(res.data);
    } catch (error) {
      console.error(
        "Error loading certificates:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // APPROVE CERTIFICATE
  // ==========================================

  const handleApprove = async (id) => {
    try {
      await approveCertificate(id);

      await loadCertificates();
    } catch (error) {
      console.error(
        "Error approving certificate:",
        error
      );
    }
  };

  // ==========================================
  // REJECT CERTIFICATE
  // ==========================================

  const handleReject = async (id) => {
    try {
      await rejectCertificate(id);

      await loadCertificates();
    } catch (error) {
      console.error(
        "Error rejecting certificate:",
        error
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="gmt-certificate-table-loading">
        <p>Loading certificates...</p>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="gmt-certificate-table-container">

      {/* ======================================
          DESKTOP TABLE
      ====================================== */}

      <div className="gmt-certificate-table-scroll">

        <table className="gmt-certificate-table">

          <thead className="gmt-certificate-table-head">

            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              <th>Certificate No.</th>
              <th>Status</th>
              <th>Issue Date</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody className="gmt-certificate-table-body">

            {certificates.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="gmt-certificate-empty-row"
                >

                  <div className="gmt-certificate-empty-content">

                    <FaCertificate className="gmt-certificate-empty-icon" />

                    <h3>
                      No Certificates Found
                    </h3>

                    <p>
                      There are currently no certificates
                      available.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              certificates.map((certificate) => {

                const statusClass =
                  certificate.status
                    ?.toLowerCase()
                    .replace(/\s+/g, "-");

                return (
                  <tr
                    key={certificate._id}
                    className="gmt-certificate-table-row"
                  >

                    {/* STUDENT */}

                    <td>

                      <div className="gmt-certificate-student">

                        <strong>
                          {certificate.student?.name ||
                            "N/A"}
                        </strong>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td>

                      <span className="gmt-certificate-email">

                        {certificate.student?.email ||
                          "N/A"}

                      </span>

                    </td>


                    {/* COURSE */}

                    <td>

                      <span className="gmt-certificate-course">

                        {certificate.course?.title ||
                          "N/A"}

                      </span>

                    </td>


                    {/* CERTIFICATE NUMBER */}

                    <td>

                      <span className="gmt-certificate-number">

                        {certificate.certificateNumber ||
                          "--"}

                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`gmt-certificate-status ${statusClass}`}
                      >
                        {certificate.status ||
                          "Pending"}
                      </span>

                    </td>


                    {/* ISSUE DATE */}

                    <td>

                      <span className="gmt-certificate-date">

                        {certificate.issueDate
                          ? new Date(
                              certificate.issueDate
                            ).toLocaleDateString()
                          : "--"}

                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="gmt-certificate-actions">

                        {/* VIEW */}

                        <button
                          type="button"
                          className="gmt-certificate-action gmt-certificate-view"
                          title="View Certificate"
                        >
                          <FaEye />
                        </button>


                        {/* PENDING ACTIONS */}

                        {certificate.status ===
                          "Pending" && (
                          <>

                            <button
                              type="button"
                              className="gmt-certificate-action gmt-certificate-approve"
                              title="Approve Certificate"
                              onClick={() =>
                                handleApprove(
                                  certificate._id
                                )
                              }
                            >
                              <FaCheck />
                            </button>

                            <button
                              type="button"
                              className="gmt-certificate-action gmt-certificate-reject"
                              title="Reject Certificate"
                              onClick={() =>
                                handleReject(
                                  certificate._id
                                )
                              }
                            >
                              <FaTimes />
                            </button>

                          </>
                        )}


                        {/* APPROVED */}

                        {certificate.status ===
                          "Approved" && (

                          <button
                            type="button"
                            className="gmt-certificate-action gmt-certificate-download"
                            title="Download Certificate"
                          >
                            <FaDownload />
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </div>


      {/* ======================================
          MOBILE CARDS
      ====================================== */}

      <div className="gmt-certificate-mobile-list">

        {certificates.length === 0 ? (

          <div className="gmt-certificate-mobile-card">

            <div className="gmt-certificate-empty-content">

              <FaCertificate className="gmt-certificate-empty-icon" />

              <h3>
                No Certificates Found
              </h3>

              <p>
                There are currently no certificates
                available.
              </p>

            </div>

          </div>

        ) : (

          certificates.map((certificate) => {

            const statusClass =
              certificate.status
                ?.toLowerCase()
                .replace(/\s+/g, "-");

            return (
              <div
                key={certificate._id}
                className="gmt-certificate-mobile-card"
              >

                {/* MOBILE HEADER */}

                <div className="gmt-certificate-mobile-header">

                  <div>

                    <h3>
                      {certificate.student?.name ||
                        "N/A"}
                    </h3>

                    <p>
                      {certificate.student?.email ||
                        "N/A"}
                    </p>

                  </div>

                  <span
                    className={`gmt-certificate-status ${statusClass}`}
                  >
                    {certificate.status ||
                      "Pending"}
                  </span>

                </div>


                {/* MOBILE DETAILS */}

                <div className="gmt-certificate-mobile-details">

                  <div>

                    <span>
                      Course
                    </span>

                    <strong>
                      {certificate.course?.title ||
                        "N/A"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Certificate No.
                    </span>

                    <strong>
                      {certificate.certificateNumber ||
                        "--"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Issue Date
                    </span>

                    <strong>
                      {certificate.issueDate
                        ? new Date(
                            certificate.issueDate
                          ).toLocaleDateString()
                        : "--"}
                    </strong>

                  </div>

                </div>


                {/* MOBILE ACTIONS */}

                <div className="gmt-certificate-mobile-actions">

                  <button
                    type="button"
                    className="gmt-certificate-action gmt-certificate-view"
                    title="View Certificate"
                  >
                    <FaEye />
                    <span>View</span>
                  </button>


                  {certificate.status ===
                    "Pending" && (
                    <>

                      <button
                        type="button"
                        className="gmt-certificate-action gmt-certificate-approve"
                        onClick={() =>
                          handleApprove(
                            certificate._id
                          )
                        }
                      >
                        <FaCheck />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        className="gmt-certificate-action gmt-certificate-reject"
                        onClick={() =>
                          handleReject(
                            certificate._id
                          )
                        }
                      >
                        <FaTimes />
                        <span>Reject</span>
                      </button>

                    </>
                  )}


                  {certificate.status ===
                    "Approved" && (

                    <button
                      type="button"
                      className="gmt-certificate-action gmt-certificate-download"
                    >
                      <FaDownload />
                      <span>Download</span>
                    </button>

                  )}

                </div>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}

export default CertificateTable;