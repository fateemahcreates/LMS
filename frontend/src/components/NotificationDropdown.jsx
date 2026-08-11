import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaTimes,
  FaBook,
  FaBullhorn,
  FaClipboardList,
  FaGraduationCap,
  FaCertificate,
  FaUser,
  FaCog,
  FaInfoCircle,
} from "react-icons/fa";

import api from "../services/api";

import "../styles/NotificationDropdown.css";


// ============================================================
// NOTIFICATION ICON
// ============================================================

const getNotificationIcon = (type) => {
  switch (type) {
    case "announcement":
      return <FaBullhorn />;

    case "assignment":
      return <FaClipboardList />;

    case "submission":
      return <FaClipboardList />;

    case "grade":
      return <FaGraduationCap />;

    case "course":
      return <FaBook />;

    case "enrollment":
      return <FaBook />;

    case "certificate":
      return <FaCertificate />;

    case "account":
      return <FaUser />;

    case "system":
      return <FaCog />;

    default:
      return <FaInfoCircle />;
  }
};


// ============================================================
// NOTIFICATION TYPE CLASS
// ============================================================

const getNotificationTypeClass = (type) => {
  switch (type) {
    case "announcement":
      return "announcement";

    case "assignment":
      return "assignment";

    case "submission":
      return "submission";

    case "grade":
      return "grade";

    case "course":
      return "course";

    case "enrollment":
      return "enrollment";

    case "certificate":
      return "certificate";

    case "account":
      return "account";

    case "system":
      return "system";

    default:
      return "default";
  }
};


// ============================================================
// TIME FORMATTER
// ============================================================

const formatNotificationTime = (date) => {
  if (!date) {
    return "";
  }

  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const now = new Date();

  const difference =
    now.getTime() -
    notificationDate.getTime();

  const seconds =
    Math.floor(difference / 1000);

  const minutes =
    Math.floor(seconds / 60);

  const hours =
    Math.floor(minutes / 60);

  const days =
    Math.floor(hours / 24);


  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }


  return notificationDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year:
        notificationDate.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  );
};


// ============================================================
// NOTIFICATION DROPDOWN
// ============================================================

function NotificationDropdown({
  onClose,
}) {

  const navigate = useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [markingAll, setMarkingAll] =
    useState(false);


  // ==========================================================
  // GET NOTIFICATIONS
  // ==========================================================

  const fetchNotifications = async () => {

    try {

      const response =
        await api.get(
          "/notifications?limit=20"
        );

      setNotifications(
        response.data?.notifications || []
      );

    } catch (error) {

      console.error(
        "Failed to load notifications:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // GET UNREAD COUNT
  // ==========================================================

  const fetchUnreadCount = async () => {

    try {

      const response =
        await api.get(
          "/notifications/unread-count"
        );

      setUnreadCount(
        response.data?.count || 0
      );

    } catch (error) {

      console.error(
        "Failed to load unread notification count:",
        error
      );

    }

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    fetchNotifications();

    fetchUnreadCount();

  }, []);


  // ==========================================================
  // MARK ONE AS READ
  // ==========================================================

  const handleMarkAsRead = async (
    notification
  ) => {

    try {

      if (!notification.isRead) {

        await api.patch(
          `/notifications/${notification._id}/read`
        );


        setNotifications(
          (previousNotifications) =>
            previousNotifications.map(
              (item) =>
                item._id ===
                notification._id
                  ? {
                      ...item,
                      isRead: true,
                      readAt:
                        new Date(),
                    }
                  : item
            )
        );


        setUnreadCount(
          (previousCount) =>
            Math.max(
              0,
              previousCount - 1
            )
        );

      }


      // ======================================================
      // NAVIGATE TO RELATED PAGE
      // ======================================================

      if (notification.link) {

        navigate(
          notification.link
        );

        if (onClose) {
          onClose();
        }

      }

    } catch (error) {

      console.error(
        "Failed to mark notification as read:",
        error
      );

    }

  };


  // ==========================================================
  // MARK ALL AS READ
  // ==========================================================

  const handleMarkAllAsRead = async () => {

    if (
      unreadCount === 0 ||
      markingAll
    ) {
      return;
    }


    try {

      setMarkingAll(true);


      await api.patch(
        "/notifications/read-all"
      );


      setNotifications(
        (previousNotifications) =>
          previousNotifications.map(
            (notification) => ({
              ...notification,
              isRead: true,
              readAt: new Date(),
            })
          )
      );


      setUnreadCount(0);

    } catch (error) {

      console.error(
        "Failed to mark all notifications as read:",
        error
      );

    } finally {

      setMarkingAll(false);

    }

  };


  // ==========================================================
  // CLOSE DROPDOWN
  // ==========================================================

  const handleClose = () => {

    if (onClose) {
      onClose();
    }

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="gmt-notification-dropdown"
    >


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="gmt-notification-header"
      >

        <div>

          <h3>
            Notifications
          </h3>

          <span>
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </span>

        </div>


        <button
          type="button"
          className="gmt-notification-close"
          onClick={handleClose}
          aria-label="Close notifications"
        >

          <FaTimes />

        </button>

      </div>


      {/* ====================================================
          ACTION BAR
      ==================================================== */}

      {notifications.length > 0 && (

        <div
          className="gmt-notification-actions"
        >

          <button
            type="button"
            onClick={
              handleMarkAllAsRead
            }
            disabled={
              unreadCount === 0 ||
              markingAll
            }
          >

            <FaCheckDouble />

            {markingAll
              ? "Marking..."
              : "Mark all as read"}

          </button>

        </div>

      )}


      {/* ====================================================
          NOTIFICATION LIST
      ==================================================== */}

      <div
        className="gmt-notification-list"
      >


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div
            className="gmt-notification-loading"
          >

            <div className="gmt-notification-spinner" />

            <p>
              Loading notifications...
            </p>

          </div>

        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          notifications.length === 0 && (

            <div
              className="gmt-notification-empty"
            >

              <div
                className="gmt-notification-empty-icon"
              >

                <FaBell />

              </div>

              <h4>
                No notifications
              </h4>

              <p>
                You don't have any
                notifications yet.
              </p>

            </div>

          )}


        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        {!loading &&
          notifications.length > 0 &&
          notifications.map(
            (notification) => {

              const typeClass =
                getNotificationTypeClass(
                  notification.type
                );


              return (

                <button
                  type="button"
                  key={
                    notification._id
                  }
                  className={`gmt-notification-item ${
                    !notification.isRead
                      ? "unread"
                      : ""
                  }`}
                  onClick={() =>
                    handleMarkAsRead(
                      notification
                    )
                  }
                >


                  {/* ========================================
                      ICON
                  ======================================== */}

                  <div
                    className={`gmt-notification-icon ${typeClass}`}
                  >

                    {getNotificationIcon(
                      notification.type
                    )}

                  </div>


                  {/* ========================================
                      CONTENT
                  ======================================== */}

                  <div
                    className="gmt-notification-content"
                  >

                    <div
                      className="gmt-notification-title-row"
                    >

                      <h4>
                        {
                          notification.title
                        }
                      </h4>


                      {!notification.isRead && (

                        <span
                          className="gmt-notification-unread-dot"
                        />

                      )}

                    </div>


                    <p>
                      {
                        notification.message
                      }
                    </p>


                    <div
                      className="gmt-notification-meta"
                    >

                      <span>

                        {formatNotificationTime(
                          notification.createdAt
                        )}

                      </span>


                      {notification.priority &&
                        notification.priority !==
                          "normal" && (

                          <span
                            className={`gmt-notification-priority ${notification.priority}`}
                          >
                            {
                              notification.priority
                            }
                          </span>

                        )}

                    </div>

                  </div>


                  {/* ========================================
                      READ INDICATOR
                  ======================================== */}

                  {notification.isRead && (

                    <div
                      className="gmt-notification-read-icon"
                      title="Read"
                    >

                      <FaCheck />

                    </div>

                  )}

                </button>

              );

            }
          )}

      </div>


      {/* ====================================================
          FOOTER
      ==================================================== */}

      {notifications.length > 0 && (

        <div
          className="gmt-notification-footer"
        >

          <button
            type="button"
            onClick={() => {

              handleClose();

              navigate(
                "/notifications"
              );

            }}
          >

         

          </button>

        </div>

      )}

    </div>

  );

}

export default NotificationDropdown;