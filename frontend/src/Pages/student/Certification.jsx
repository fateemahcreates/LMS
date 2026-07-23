import { useEffect, useState } from "react";

import "../../styles/StudentCertificates.css";

import {
  FaCertificate,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import { getMyCertificates } from "../../services/certificateService";

import CertificateCard from "../../components/student/CertificateCard";

function Certification() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await getMyCertificates();
      setCertificates(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const total = certificates.length;

  const approved = certificates.filter(
    (certificate) => certificate.status === "Approved"
  ).length;

  const pending = certificates.filter(
    (certificate) => certificate.status === "Pending"
  ).length;

  if (loading) {
    return (
      <div className="student-certificates-page">
        <h2>Loading certificates...</h2>
      </div>
    );
  }

  return (
    <div className="student-certificates-page">

      {/* Header */}

      <div className="student-certificate-header">

        <div>
          <h1>My Certificates</h1>

          <p>
            View and download your earned
            certificates.
          </p>
        </div>

      </div>

      {/* Statistics */}

      <div className="certificate-summary">

        <div className="summary-card">

          <FaCertificate />

          <div>
            <h2>{total}</h2>
            <p>Total Certificates</p>
          </div>

        </div>

        <div className="summary-card approved">

          <FaCheckCircle />

          <div>
            <h2>{approved}</h2>
            <p>Approved</p>
          </div>

        </div>

        <div className="summary-card pending">

          <FaClock />

          <div>
            <h2>{pending}</h2>
            <p>Pending</p>
          </div>

        </div>

      </div>

      {/* Certificates */}

      <div className="certificate-grid">

        {certificates.length === 0 ? (

          <div className="empty-certificates">

            <FaCertificate />

            <h2>No Certificates Yet</h2>

            <p>
              Complete a course to earn your
              first certificate.
            </p>

          </div>

        ) : (

          certificates.map((certificate) => (
            <CertificateCard
              key={certificate._id}
              certificate={certificate}
            />
          ))

        )}

      </div>

    </div>
  );
}

export default Certification;