const mongoose = require("mongoose");

const Notification = require("../models/Notification");

const {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../services/notificationService");


// ============================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// ============================================================

// ============================================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// ============================================================

const getNotifications = async (req, res) => {
  try {
    // ========================================================
    // AUTHENTICATED USER
    // ========================================================

    console.log("========================================");
    console.log("NOTIFICATION REQUEST");
    console.log("Authenticated user:", req.user);
    console.log("Authenticated user ID:", req.user?._id);
    console.log("Authenticated user role:", req.user?.role);
    console.log("========================================");

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    // ========================================================
    // LIMIT
    // ========================================================

    const limit = Math.min(
      Number(req.query.limit) || 20,
      100
    );

    // ========================================================
    // GET NOTIFICATIONS
    // ========================================================

    const notifications =
      await getUserNotifications(
        req.user._id,
        limit
      );

    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
      "Notification count:",
      notifications.length
    );

    if (notifications.length > 0) {
      console.log(
        "First notification recipient:",
        notifications[0].recipient
      );

      console.log(
        "First notification ID:",
        notifications[0]._id
      );
    }

    console.log("========================================");

    // ========================================================
    // RESPONSE
    // ========================================================

    res.status(200).json({
      message: "Notifications loaded successfully.",
      notifications,
    });

  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      message: "Failed to load notifications.",
      error: error.message,
    });
  }
};


// ============================================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread-count
// ============================================================

const getUnreadCount = async (
  req,
  res
) => {

  try {

    const count =
      await getUnreadNotificationCount(
        req.user._id
      );

    res.status(200).json({
      count,
    });

  } catch (error) {

    console.error(
      "Get unread notification count error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to get unread notification count.",

      error:
        error.message,

    });
  }
};


// ============================================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ============================================================

const markAsRead = async (
  req,
  res
) => {

  try {

    // ========================================================
    // VALIDATE ID
    // ========================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({

        message:
          "Invalid notification ID.",

      });
    }

    const notification =
      await markNotificationAsRead(
        req.params.id,
        req.user._id
      );

    if (!notification) {

      return res.status(404).json({

        message:
          "Notification not found.",

      });
    }

    res.status(200).json({

      message:
        "Notification marked as read.",

      notification,

    });

  } catch (error) {

    console.error(
      "Mark notification as read error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to mark notification as read.",

      error:
        error.message,

    });
  }
};


// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// ============================================================

const markAllAsRead = async (
  req,
  res
) => {

  try {

    const result =
      await markAllNotificationsAsRead(
        req.user._id
      );

    res.status(200).json({

      message:
        "All notifications marked as read.",

      modifiedCount:
        result.modifiedCount,

    });

  } catch (error) {

    console.error(
      "Mark all notifications as read error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to mark all notifications as read.",

      error:
        error.message,

    });
  }
};


// ============================================================
// DELETE ONE NOTIFICATION
// DELETE /api/notifications/:id
// ============================================================

const deleteNotification = async (
  req,
  res
) => {

  try {

    // ========================================================
    // VALIDATE ID
    // ========================================================

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({

        message:
          "Invalid notification ID.",

      });
    }

    // ========================================================
    // DELETE ONLY USER'S OWN NOTIFICATION
    // ========================================================

    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,

        recipient:
          req.user._id,
      });

    if (!notification) {

      return res.status(404).json({

        message:
          "Notification not found.",

      });
    }

    res.status(200).json({

      message:
        "Notification deleted successfully.",

    });

  } catch (error) {

    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete notification.",

      error:
        error.message,

    });
  }
};


// ============================================================
// DELETE ALL READ NOTIFICATIONS
// DELETE /api/notifications/read
// ============================================================

const deleteReadNotifications = async (
  req,
  res
) => {

  try {

    const result =
      await Notification.deleteMany({

        recipient:
          req.user._id,

        isRead: true,

      });

    res.status(200).json({

      message:
        "Read notifications deleted successfully.",

      deletedCount:
        result.deletedCount,

    });

  } catch (error) {

    console.error(
      "Delete read notifications error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to delete read notifications.",

      error:
        error.message,

    });
  }
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

  getNotifications,

  getUnreadCount,

  markAsRead,

  markAllAsRead,

  deleteNotification,

  deleteReadNotifications,

};