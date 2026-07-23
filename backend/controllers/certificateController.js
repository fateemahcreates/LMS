const Certificate = require("../models/Certificate");
const Enrollment = require("../models/Enrollment");

// ==========================================
// GENERATE CERTIFICATE
// ==========================================
const generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("student")
      .populate("course");

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found.",
      });
    }

    // Prevent duplicate certificate
    const existingCertificate = await Certificate.findOne({
      enrollment: enrollment._id,
    });

    if (existingCertificate) {
      return res.status(400).json({
        message: "Certificate already exists.",
      });
    }

    // Only completed courses
    if (enrollment.status !== "Completed") {
      return res.status(400).json({
        message: "Course has not been completed.",
      });
    }

    // Generate certificate number
    const totalCertificates = await Certificate.countDocuments();

    const year = new Date().getFullYear();

    const certificateNumber = `GMT-LMS-${year}-${String(
      totalCertificates + 1
    ).padStart(6, "0")}`;

    // Generate verification code
    const verificationCode =
      Math.random().toString(36).substring(2, 12).toUpperCase();

    const certificate = await Certificate.create({
      student: enrollment.student._id,
      course: enrollment.course._id,
      enrollment: enrollment._id,
      certificateNumber,
      verificationCode,
      status: "Pending",
    });

    res.status(201).json({
      message: "Certificate generated successfully.",
      certificate,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET MY CERTIFICATES
// ==========================================
const getMyCertificates = async (req, res) => {
  try {

    const certificates = await Certificate.find({
      student: req.user._id,
    })
      .populate("course", "title code")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(certificates);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ==========================================
// GET ALL CERTIFICATES
// ==========================================
const getCertificates = async (req, res) => {
  try {

    const certificates = await Certificate.find()
      .populate("student", "name email")
      .populate("course", "title code")
      .populate("approvedBy", "name")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(certificates);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ==========================================
// APPROVE CERTIFICATE
// ==========================================
const approveCertificate = async (req, res) => {
  try {

    const certificate = await Certificate.findById(
      req.params.id
    );

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found.",
      });
    }

    certificate.status = "Approved";
    certificate.approvedBy = req.user._id;
    certificate.approvedAt = new Date();
    certificate.issueDate = new Date();

    await certificate.save();

    res.status(200).json({
      message: "Certificate approved successfully.",
      certificate,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// ==========================================
// CERTIFICATE DASHBOARD STATS
// GET /api/certificates/stats
// ==========================================
const getCertificateStats = async (req, res) => {
  try {

    const total = await Certificate.countDocuments();

    const approved = await Certificate.countDocuments({
      status: "Approved",
    });

    const pending = await Certificate.countDocuments({
      status: "Pending",
    });

    const rejected = await Certificate.countDocuments({
      status: "Rejected",
    });

    res.json({
      total,
      approved,
      pending,
      rejected,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// REJECT CERTIFICATE
// ==========================================
const rejectCertificate = async (req, res) => {
  try {

    const certificate = await Certificate.findById(
      req.params.id
    );

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found.",
      });
    }

    certificate.status = "Rejected";

    await certificate.save();

    res.status(200).json({
      message: "Certificate rejected.",
      certificate,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  generateCertificate,
  getMyCertificates,
  getCertificates,
  approveCertificate,
  rejectCertificate,
  getCertificateStats,
};