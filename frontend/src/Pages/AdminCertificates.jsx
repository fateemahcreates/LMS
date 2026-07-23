import { useEffect, useState } from "react";

import "../styles/AdminCertificates.css";

import {
  FaCertificate,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  getCertificateStats,
} from "../services/certificateService";

import CertificateTable from "../components/CertificateTable";
import GenerateCertificateModal from "../components/GenerateCertificateModal";

function AdminCertificates() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    loadStats();
  }, [refresh]);

  const loadStats = async () => {
    try {
      const res = await getCertificateStats();

      setStats(res.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Certificates",
      value: stats.total,
      icon: <FaCertificate />,
      color: "blue",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <FaClock />,
      color: "orange",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: <FaCheckCircle />,
      color: "green",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: <FaTimesCircle />,
      color: "red",
    },
  ];

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="admin-certificates">

      {/* Header */}

      <div className="certificate-header">

        <div>

          <h1>Certificate Management</h1>

          <p>
            Manage certificate approvals,
            downloads and verification.
          </p>

        </div>

        <button
          className="generate-btn"
          onClick={() => setShowModal(true)}
        >
          Generate Certificate
        </button>

      </div>

      {/* Statistics */}

      {loading ? (

        <p>Loading statistics...</p>

      ) : (

        <div className="certificate-stats">

          {cards.map((card, index) => (

            <div
              key={index}
              className={`certificate-card ${card.color}`}
            >

              <div className="certificate-icon">
                {card.icon}
              </div>

              <div>

                <h2>{card.value}</h2>

                <p>{card.title}</p>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* Certificate Table */}

      <CertificateTable refresh={refresh} />

      {/* Generate Certificate Modal */}

      <GenerateCertificateModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleRefresh}
      />

    </div>
  );
}

export default AdminCertificates;