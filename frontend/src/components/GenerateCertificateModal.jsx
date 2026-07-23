import { useEffect, useState } from "react";

import {
  generateCertificate,
} from "../services/certificateService";

import {
  getAllEnrollments,
} from "../services/enrollmentService";

import "../styles/GenerateCertificateModal.css";

function GenerateCertificateModal({
  open,
  onClose,
  onSuccess,
}) {
  const [enrollments, setEnrollments] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (open) {
      loadEnrollments();
    }
  }, [open]);

  const loadEnrollments = async () => {
    try {
      const res = await getAllEnrollments();

      const completed = res.data.filter(
        (enrollment) =>
          enrollment.status === "Completed"
      );

      setEnrollments(completed);

    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    if (!selected) {
      alert("Please select a completed enrollment.");
      return;
    }

    try {

      await generateCertificate({
        enrollmentId: selected,
      });

      alert("Certificate generated successfully.");

      onSuccess();

      onClose();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to generate certificate."
      );

    }
  };

  if (!open) return null;

  return (
    <div className="certificate-modal-overlay">

      <div className="certificate-modal">

       <h2>Generate Certificate</h2>

<p>
  Select a completed student enrollment to generate
  a certificate.
</p>
        <select
          value={selected}
          onChange={(e) =>
            setSelected(e.target.value)
          }
        >

          <option value="">
            Select Completed Enrollment
          </option>

          {enrollments.map((enrollment) => (

            <option
              key={enrollment._id}
              value={enrollment._id}
            >
              {enrollment.student.name} —
              {" "}
              {enrollment.course.title}
            </option>

          ))}

        </select>

        <div className="modal-buttons">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="generate-btn"
            onClick={handleGenerate}
          >
            Generate
          </button>

        </div>

      </div>

    </div>
  );
}

export default GenerateCertificateModal;