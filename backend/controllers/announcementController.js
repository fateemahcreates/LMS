const Announcement = require("../models/Announcement");

// ==========================================
// CREATE ANNOUNCEMENT
// POST /api/announcements
// ==========================================
const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      audience: req.body.audience,
      course: req.body.course || null,
      isPinned: req.body.isPinned || false,
      status: req.body.status || "Active",
      expiresAt: req.body.expiresAt || null,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Announcement created successfully.",
      announcement,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ANNOUNCEMENTS
// GET /api/announcements
// ==========================================
const getAnnouncements = async (req, res) => {
  try {

    const announcements = await Announcement.find({
      status: "Active",
    })
      .populate("course", "title")
      .populate("createdBy", "name")
      .sort({
        isPinned: -1,
        createdAt: -1,
      });

    res.json(announcements);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE ANNOUNCEMENT
// GET /api/announcements/:id
// ==========================================
const getAnnouncement = async (req, res) => {
  try {

    const announcement = await Announcement.findById(req.params.id)
      .populate("course", "title")
      .populate("createdBy", "name");

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    res.json(announcement);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE ANNOUNCEMENT
// PUT /api/announcements/:id
// ==========================================
const updateAnnouncement = async (req, res) => {
  try {

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    announcement.title = req.body.title;
    announcement.description = req.body.description;
    announcement.type = req.body.type;
    announcement.audience = req.body.audience;
    announcement.course = req.body.course || null;
    announcement.isPinned = req.body.isPinned;
    announcement.status = req.body.status;
    announcement.expiresAt = req.body.expiresAt || null;

    await announcement.save();

    res.json({
      message: "Announcement updated successfully.",
      announcement,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// DELETE ANNOUNCEMENT
// DELETE /api/announcements/:id
// ==========================================
const deleteAnnouncement = async (req, res) => {
  try {

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    await announcement.deleteOne();

    res.json({
      message: "Announcement deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// PIN / UNPIN ANNOUNCEMENT
// PATCH /api/announcements/:id/pin
// ==========================================
const togglePinAnnouncement = async (req, res) => {
  try {

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: "Announcement not found.",
      });
    }

    announcement.isPinned = !announcement.isPinned;

    await announcement.save();

    res.json({
      message: announcement.isPinned
        ? "Announcement pinned."
        : "Announcement unpinned.",
      announcement,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
};