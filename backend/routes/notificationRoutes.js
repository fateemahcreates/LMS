const express = require("express");

const router = express.Router();

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
} = require("../controllers/notificationController");


// ============================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// ============================================================

router.get(
  "/",
  protect,
  getNotifications
);


// ============================================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread-count
// ============================================================

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);


// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// ============================================================

router.patch(
  "/read-all",
  protect,
  markAllAsRead
);


// ============================================================
// DELETE ALL READ NOTIFICATIONS
// DELETE /api/notifications/read
// ============================================================

router.delete(
  "/read",
  protect,
  deleteReadNotifications
);


// ============================================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ============================================================

router.patch(
  "/:id/read",
  protect,
  markAsRead
);


// ============================================================
// DELETE ONE NOTIFICATION
// DELETE /api/notifications/:id
// ============================================================

router.delete(
  "/:id",
  protect,
  deleteNotification
);


module.exports = router;