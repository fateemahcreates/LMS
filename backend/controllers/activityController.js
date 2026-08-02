const Submission = require("../models/Submission");
const Announcement = require("../models/Announcement");
const Certificate = require("../models/Certificate");

// ==========================================
// GET LATEST ACTIVITY
// ==========================================
const getLatestActivity = async (req, res) => {
  try {
    // Latest assignment submissions
    const submissions = await Submission.find()
      .populate("student", "name")
      .populate("assignment", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // Latest graded assignments
    const graded = await Submission.find({
      status: "Graded",
    })
      .populate("student", "name")
      .populate("assignment", "title")
      .sort({ gradedAt: -1 })
      .limit(5);

    // Latest announcements
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Latest certificates
    const certificates = await Certificate.find()
      .populate("student", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = [];

    // Assignment Submitted
    submissions.forEach((submission) => {
      activities.push({
        type: "submission",
        title: "Assignment Submitted",
        description: `${submission.student?.name || "Student"} submitted ${
          submission.assignment?.title || "an assignment"
        }`,
        createdAt: submission.createdAt,
      });
    });

    // Assignment Graded
    graded.forEach((submission) => {
      activities.push({
        type: "graded",
        title: "Assignment Graded",
        description: `${submission.assignment?.title || "Assignment"} graded`,
        createdAt: submission.gradedAt || submission.updatedAt,
      });
    });

    // Announcements
    announcements.forEach((announcement) => {
      activities.push({
        type: "announcement",
        title: "Announcement Published",
        description: announcement.title,
        createdAt: announcement.createdAt,
      });
    });

    // Certificates
    certificates.forEach((certificate) => {
      activities.push({
        type: "certificate",
        title: "Certificate Issued",
        description: `${certificate.student?.name || "Student"} completed ${
    certificate.course?.title || "a course"
}`,
        createdAt: certificate.createdAt,
      });
    });

    // Sort newest first
    activities.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to load latest activity.",
    });
  }
};

module.exports = {
  getLatestActivity,
};