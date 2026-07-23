import { useEffect, useState } from "react";

import {
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
} from "react-icons/fa";

import {
  getCertificates,
  approveCertificate,
  rejectCertificate,
} from "../services/certificateService";

import "../styles/CertificateTable.css";

function CertificateTable() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await getCertificates();
      setCertificates(res.data);
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveCertificate(id);
      loadCertificates();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCertificate(id);
      loadCertificates();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="certificate-table">
        <p>Loading certificates...</p>
      </div>
    );
  }

  return (
    <div className="certificate-table">

      <table>

        <thead>

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

        <tbody>

          {certificates.length === 0 ? (

            <tr>

              <td colSpan="7" className="empty-row">
                No certificates found.
              </td>

            </tr>

          ) : (

            certificates.map((certificate) => (

              <tr key={certificate._id}>

                <td>
                  {certificate.student?.name}
                </td>

                <td>
                  {certificate.student?.email}
                </td>

                <td>
                  {certificate.course?.title}
                </td>

                <td>
                  {certificate.certificateNumber}
                </td>

                <td>

                  <span
                    className={`status ${certificate.status.toLowerCase()}`}
                  >
                    {certificate.status}
                  </span>

                </td>

                <td>

                  {certificate.issueDate
                    ? new Date(
                        certificate.issueDate
                      ).toLocaleDateString()
                    : "--"}

                </td>

                <td>

                  <div className="certificate-actions">

                    <button
                      className="view-btn"
                    >
                      <FaEye />
                    </button>

                    {certificate.status === "Pending" && (

                      <>

                        <button
                          className="approve-btn"
                          onClick={() =>
                            handleApprove(
                              certificate._id
                            )
                          }
                        >
                          <FaCheck />
                        </button>

                        <button
                          className="reject-btn"
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

                    {certificate.status === "Approved" && (

                      <button
                        className="download-btn"
                      >
                        <FaDownload />
                      </button>

                    )}

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default CertificateTable;