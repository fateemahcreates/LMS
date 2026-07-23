import {
  FaCertificate,
  FaDownload,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

import "../../styles/CertificateCard.css";

function CertificateCard({ certificate }) {
  const formatDate = (date) => {
    if (!date) return "Not Issued";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="certificate-card-student">

      {/* Certificate Icon */}

      <div className="certificate-top">

        <div className="certificate-logo">

          <FaCertificate />

        </div>

        <div>

          <h2>
            {certificate.course?.title || "Course"}
          </h2>

          <p>
            {certificate.course?.code}
          </p>

        </div>

      </div>

      {/* Certificate Details */}

      <div className="certificate-body">

        <div className="certificate-item">

          <span>Certificate No.</span>

          <strong>
            {certificate.certificateNumber}
          </strong>

        </div>

        <div className="certificate-item">

          <span>Verification Code</span>

          <strong>
            {certificate.verificationCode}
          </strong>

        </div>

        <div className="certificate-item">

          <span>Issue Date</span>

          <strong>
            {formatDate(certificate.issueDate)}
          </strong>

        </div>

        <div className="certificate-item">

          <span>Status</span>

          {certificate.status === "Approved" && (
            <div className="status approved">

              <FaCheckCircle />

              Approved

            </div>
          )}

          {certificate.status === "Pending" && (
            <div className="status pending">

              <FaClock />

              Pending

            </div>
          )}

          {certificate.status === "Rejected" && (
            <div className="status rejected">

              <FaTimesCircle />

              Rejected

            </div>
          )}

        </div>

      </div>

      {/* Footer */}

      <div className="certificate-footer">

        {certificate.status === "Approved" ? (

          <button className="download-btn">

            <FaDownload />

            Download Certificate

          </button>

        ) : (

          <button
            className="download-btn disabled"
            disabled
          >
            Certificate Not Available
          </button>

        )}

      </div>

    </div>
  );
}

export default CertificateCard;