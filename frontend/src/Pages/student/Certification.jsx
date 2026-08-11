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
    (certificate) =>
      certificate.status === "Approved"
  ).length;

  const pending = certificates.filter(
    (certificate) =>
      certificate.status === "Pending"
  ).length;

  if (loading) {
    return (

      <main className="gmt-certificates-page">

        <div className="gmt-certificates-loading">

          <h2>Loading Certificates...</h2>

        </div>

      </main>

    );
  }

  return (

    <main className="gmt-certificates-page">

      {/* =======================================
          HEADER
      ======================================== */}

      <div className="gmt-certificates-header">

        <span className="gmt-certificates-tag">

          GMT SOFTWARE ACADEMY

        </span>

        <h1>

          My Certificates

        </h1>

        <p>

          View, verify and download every
          professional certificate you have
          earned from GMT Software Academy.

        </p>

      </div>

      {/* =======================================
          SUMMARY
      ======================================== */}

      <div className="gmt-certificates-summary">

        <div className="gmt-summary-card">

          <FaCertificate
            className="gmt-summary-icon"
          />

          <div>

            <h2>{total}</h2>

            <p>Total Certificates</p>

          </div>

        </div>

        <div className="gmt-summary-card gmt-approved">

          <FaCheckCircle
            className="gmt-summary-icon"
          />

          <div>

            <h2>{approved}</h2>

            <p>Approved</p>

          </div>

        </div>

        <div className="gmt-summary-card gmt-pending">

          <FaClock
            className="gmt-summary-icon"
          />

          <div>

            <h2>{pending}</h2>

            <p>Pending Approval</p>

          </div>

        </div>

      </div>

      {/* =======================================
          CERTIFICATES
      ======================================== */}

      <div className="gmt-certificates-grid">

        {certificates.length === 0 ? (

          <div className="gmt-certificates-empty">

            <FaCertificate className="gmt-empty-icon" />

            <h2>

              No Certificates Yet

            </h2>

            <p>

              Complete your GMT Software
              Academy training to earn your
              first professional certificate.

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

    </main>

  );

}

export default Certification;