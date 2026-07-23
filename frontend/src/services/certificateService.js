import api from "./api";

// =============================
// Admin
// =============================

export const getCertificates = () =>
  api.get("/certificates");

export const getCertificateStats = () =>
  api.get("/certificates/stats");

export const generateCertificate = (enrollmentId) =>
  api.post("/certificates/generate", {
    enrollmentId,
  });

export const approveCertificate = (id) =>
  api.put(`/certificates/approve/${id}`);

export const rejectCertificate = (id) =>
  api.put(`/certificates/reject/${id}`);

// =============================
// Student
// =============================

export const getMyCertificates = () =>
  api.get("/certificates/my");