const express = require("express");

const router = express.Router();

const {
  generateCertificate,
  getMyCertificates,
  getCertificates,
  approveCertificate,
  rejectCertificate,
  getCertificateStats,
} = require("../controllers/certificateController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ==========================================
// STUDENT ROUTES
// ==========================================


// Get my certificates
router.get(
  "/my",
  protect,
  authorize("student"),
  getMyCertificates
);

// ==========================================
// ADMIN ROUTES
// ==========================================


// Certificate dashboard statistics
router.get(
  "/stats",
  protect,
  authorize("admin"),
  getCertificateStats
);

// Generate certificate
router.post(
  "/generate",
  protect,
  authorize("admin"),
  generateCertificate
);

// Get all certificates
router.get(
  "/",
  protect,
  authorize("admin"),
  getCertificates
);

// Approve certificate
router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveCertificate
);

// Reject certificate
router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  rejectCertificate
);

module.exports = router;