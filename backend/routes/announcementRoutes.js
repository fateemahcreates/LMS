const express = require("express");

const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
} = require("../controllers/announcementController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// ==========================================
// STUDENTS & ADMINS
// ==========================================

// Get all active announcements
router.get(
  "/",
  protect,
  getAnnouncements
);

// Get single announcement
router.get(
  "/:id",
  protect,
  getAnnouncement
);

// ==========================================
// ADMIN ONLY
// ==========================================

// Create announcement
router.post(
  "/",
  protect,
  authorize("admin"),
  createAnnouncement
);

// Update announcement
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateAnnouncement
);

// Delete announcement
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteAnnouncement
);

// Pin / Unpin announcement
router.patch(
  "/:id/pin",
  protect,
  authorize("admin"),
  togglePinAnnouncement
);

module.exports = router;