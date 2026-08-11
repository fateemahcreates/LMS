const Notification = require("../models/Notification");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ============================================================
// DEFAULT NOTIFICATION PREFERENCES
// ============================================================

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  assignmentNotifications: true,
  announcementNotifications: true,
  courseNotifications: true,
  systemNotifications: true,
};


// ============================================================
// GET USER NOTIFICATION PREFERENCES
// ============================================================

const getNotificationPreferences = (user) => {
  return {
    ...DEFAULT_PREFERENCES,
    ...(user?.notificationPreferences || {}),
  };
};


// ============================================================
// CHECK WHETHER EMAIL SHOULD BE SENT
// ============================================================

const shouldSendEmail = (user, type) => {
  const preferences =
    getNotificationPreferences(user);

  // Master email switch
  if (!preferences.emailNotifications) {
    return false;
  }

  // ========================================================
  // MAP NOTIFICATION TYPE TO USER PREFERENCE
  // ========================================================

  switch (type) {
    case "announcement":
      return preferences.announcementNotifications;

    case "assignment":
    case "submission":
    case "grade":
      return preferences.assignmentNotifications;

    case "course":
    case "enrollment":
      return preferences.courseNotifications;

    case "system":
    case "account":
    case "certificate":
      return preferences.systemNotifications;

    default:
      return true;
  }
};


// ============================================================
// CREATE IN-APP NOTIFICATION
// ============================================================

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  link = "",
  relatedId = null,
  relatedModel = null,
  priority = "normal",
}) => {
  try {
    if (!recipient) {
      throw new Error(
        "Notification recipient is required."
      );
    }

    if (!type) {
      throw new Error(
        "Notification type is required."
      );
    }

    if (!title) {
      throw new Error(
        "Notification title is required."
      );
    }

    if (!message) {
      throw new Error(
        "Notification message is required."
      );
    }

    const notification =
      await Notification.create({
        recipient,
        type,
        title,
        message,
        link,
        relatedId,
        relatedModel,
        priority,
      });

    return notification;
  } catch (error) {
    console.error(
      "Create notification error:",
      error
    );

    throw error;
  }
};


// ============================================================
// SEND EMAIL NOTIFICATION
// ============================================================

const sendNotificationEmail = async ({
  user,
  title,
  message,
  type,
}) => {
  try {
    if (!user) {
      throw new Error(
        "User is required for email notification."
      );
    }

    if (!user.email) {
      throw new Error(
        "User does not have an email address."
      );
    }

    // ========================================================
    // CHECK USER PREFERENCES
    // ========================================================

    const allowed =
      shouldSendEmail(user, type);

    if (!allowed) {
      return {
        sent: false,
        skipped: true,
        reason:
          "Email notifications are disabled.",
      };
    }

    // ========================================================
    // EMAIL HTML
    // ========================================================

    const html = `
      <div
        style="
          margin:0;
          padding:0;
          background:#f5f7fb;
          font-family:Arial,Helvetica,sans-serif;
        "
      >

        <div
          style="
            max-width:650px;
            margin:40px auto;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            border:1px solid #e5e7eb;
          "
        >

          <!-- HEADER -->

          <div
            style="
              padding:28px 32px;
              background:#C91F26;
              color:#ffffff;
            "
          >

            <h1
              style="
                margin:0;
                font-size:24px;
              "
            >
              GMT LMS
            </h1>

            <p
              style="
                margin:8px 0 0;
                font-size:14px;
                opacity:0.9;
              "
            >
              Learning Management System
            </p>

          </div>


          <!-- CONTENT -->

          <div
            style="
              padding:32px;
              color:#111827;
            "
          >

            <p
              style="
                margin:0 0 10px;
                font-size:14px;
                color:#6b7280;
              "
            >
              You have a new notification
            </p>

            <h2
              style="
                margin:0 0 18px;
                font-size:22px;
                color:#111827;
              "
            >
              ${title}
            </h2>

            <p
              style="
                margin:0;
                line-height:1.7;
                font-size:15px;
                color:#4b5563;
              "
            >
              Hello ${user.name || "User"},
            </p>

            <p
              style="
                margin:16px 0 0;
                line-height:1.7;
                font-size:15px;
                color:#4b5563;
              "
            >
              ${message}
            </p>


            <!-- BUTTON -->

            ${
              process.env.CLIENT_URL
                ? `
                  <div
                    style="
                      margin-top:28px;
                    "
                  >

                    <a
                      href="${process.env.CLIENT_URL}"
                      style="
                        display:inline-block;
                        padding:12px 22px;
                        background:#C91F26;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:7px;
                        font-size:14px;
                        font-weight:bold;
                      "
                    >
                      Open GMT LMS
                    </a>

                  </div>
                `
                : ""
            }

          </div>


          <!-- FOOTER -->

          <div
            style="
              padding:20px 32px;
              border-top:1px solid #e5e7eb;
              background:#fafafa;
            "
          >

            <p
              style="
                margin:0;
                font-size:12px;
                color:#9ca3af;
                line-height:1.6;
              "
            >
              You are receiving this email because
              email notifications are enabled on your
              GMT LMS account.
            </p>

            <p
              style="
                margin:8px 0 0;
                font-size:12px;
                color:#9ca3af;
              "
            >
              GMT LMS Team
            </p>

          </div>

        </div>

      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: `GMT LMS - ${title}`,
      html,
    });

    return {
      sent: true,
      skipped: false,
    };
  } catch (error) {
    console.error(
      "Send notification email error:",
      error
    );

    return {
      sent: false,
      skipped: false,
      error: error.message,
    };
  }
};


// ============================================================
// CREATE NOTIFICATION + SEND EMAIL
// ============================================================

const notifyUser = async ({
  recipient,
  type,
  title,
  message,
  link = "",
  relatedId = null,
  relatedModel = null,
  priority = "normal",
  sendEmailNotification = true,
}) => {
  try {
    // ========================================================
    // FIND USER
    // ========================================================

    const user =
      await User.findById(recipient);

    if (!user) {
      throw new Error(
        "Notification recipient not found."
      );
    }

    // ========================================================
    // CREATE IN-APP NOTIFICATION
    // ========================================================

    const notification =
      await createNotification({
        recipient: user._id,
        type,
        title,
        message,
        link,
        relatedId,
        relatedModel,
        priority,
      });


    // ========================================================
    // EMAIL
    // ========================================================

    if (sendEmailNotification) {
      const emailResult =
        await sendNotificationEmail({
          user,
          title,
          message,
          type,
        });


      // ======================================================
      // UPDATE EMAIL STATUS
      // ======================================================

      if (emailResult.sent) {
        notification.emailSent = true;
        notification.emailSentAt = new Date();
        notification.emailError = "";

        await notification.save();
      } else if (emailResult.error) {
        notification.emailSent = false;
        notification.emailError =
          emailResult.error;

        await notification.save();
      }
    }

    return notification;
  } catch (error) {
    console.error(
      "Notify user error:",
      error
    );

    throw error;
  }
};


// ============================================================
// NOTIFY MULTIPLE USERS
// ============================================================

const notifyUsers = async ({
  recipients,
  type,
  title,
  message,
  link = "",
  relatedId = null,
  relatedModel = null,
  priority = "normal",
  sendEmailNotification = true,
}) => {
  try {
    if (
      !Array.isArray(recipients) ||
      recipients.length === 0
    ) {
      return [];
    }

    const notifications = [];

    for (const recipient of recipients) {
      try {
        const notification =
          await notifyUser({
            recipient,
            type,
            title,
            message,
            link,
            relatedId,
            relatedModel,
            priority,
            sendEmailNotification,
          });

        notifications.push(notification);
      } catch (error) {
        console.error(
          `Notification failed for user ${recipient}:`,
          error.message
        );
      }
    }

    return notifications;
  } catch (error) {
    console.error(
      "Notify users error:",
      error
    );

    throw error;
  }
};


// ============================================================
// NOTIFY USERS BY ROLE
// ============================================================

const notifyUsersByRole = async ({
  role,
  type,
  title,
  message,
  link = "",
  relatedId = null,
  relatedModel = null,
  priority = "normal",
  sendEmailNotification = true,
}) => {
  try {
    const users =
      await User.find({
        role,
        status: {
          $ne: "inactive",
        },
      }).select(
        "_id name email notificationPreferences"
      );

    if (!users.length) {
      return [];
    }

    return await notifyUsers({
      recipients: users.map(
        (user) => user._id
      ),
      type,
      title,
      message,
      link,
      relatedId,
      relatedModel,
      priority,
      sendEmailNotification,
    });
  } catch (error) {
    console.error(
      "Notify users by role error:",
      error
    );

    throw error;
  }
};


// ============================================================
// MARK NOTIFICATION AS READ
// ============================================================

const markNotificationAsRead =
  async (notificationId, userId) => {
    try {
      const notification =
        await Notification.findOne({
          _id: notificationId,
          recipient: userId,
        });

      if (!notification) {
        return null;
      }

      notification.isRead = true;
      notification.readAt = new Date();

      await notification.save();

      return notification;
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error
      );

      throw error;
    }
  };


// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================

const markAllNotificationsAsRead =
  async (userId) => {
    try {
      await Notification.updateMany(
        {
          recipient: userId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
            readAt: new Date(),
          },
        }
      );

      return true;
    } catch (error) {
      console.error(
        "Mark all notifications as read error:",
        error
      );

      throw error;
    }
  };


// ============================================================
// GET USER NOTIFICATIONS
// ============================================================

const getUserNotifications =
  async (
    userId,
    limit = 20
  ) => {
    try {
      const notifications =
        await Notification.find({
          recipient: userId,
        })
          .sort({
            createdAt: -1,
          })
          .limit(Number(limit));

      return notifications;
    } catch (error) {
      console.error(
        "Get user notifications error:",
        error
      );

      throw error;
    }
  };


// ============================================================
// GET UNREAD COUNT
// ============================================================

const getUnreadNotificationCount =
  async (userId) => {
    try {
      return await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });
    } catch (error) {
      console.error(
        "Get unread notification count error:",
        error
      );

      throw error;
    }
  };

  // ============================================================
// SEND ACCOUNT CREATION EMAIL
// ============================================================
// Sends newly created users their login credentials.
//
// IMPORTANT:
// The password passed here is the ORIGINAL plain password
// supplied during account creation.
// It is NEVER stored in MongoDB.
// ============================================================

const sendAccountCreationEmail = async ({
  user,
  password,
}) => {
  try {
    if (!user) {
      throw new Error(
        "User is required for account creation email."
      );
    }

    if (!user.email) {
      throw new Error(
        "User does not have an email address."
      );
    }

    if (!password) {
      throw new Error(
        "Password is required for account creation email."
      );
    }

    // ========================================================
    // LOGIN URL
    // ========================================================

    const loginUrl =
      process.env.CLIENT_URL
        ? `${process.env.CLIENT_URL}/login`
        : "";

    // ========================================================
    // ROLE DISPLAY
    // ========================================================

    const roleName =
      user.role
        ? user.role.charAt(0).toUpperCase() +
          user.role.slice(1)
        : "User";

    // ========================================================
    // EMAIL HTML
    // ========================================================

    const html = `
      <div
        style="
          margin:0;
          padding:0;
          background:#f5f7fb;
          font-family:Arial,Helvetica,sans-serif;
        "
      >

        <div
          style="
            max-width:650px;
            margin:40px auto;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            border:1px solid #e5e7eb;
          "
        >

          <!-- HEADER -->

          <div
            style="
              padding:30px 32px;
              background:#C91F26;
              color:#ffffff;
            "
          >

            <h1
              style="
                margin:0;
                font-size:26px;
              "
            >
              GMT LMS
            </h1>

            <p
              style="
                margin:8px 0 0;
                font-size:14px;
              "
            >
              Learning Management System
            </p>

          </div>


          <!-- CONTENT -->

          <div
            style="
              padding:32px;
              color:#111827;
            "
          >

            <h2
              style="
                margin:0 0 12px;
                font-size:24px;
              "
            >
              Welcome to GMT LMS, ${user.name || "User"}!
            </h2>

            <p
              style="
                margin:0 0 20px;
                font-size:15px;
                line-height:1.7;
                color:#4b5563;
              "
            >
              Your GMT LMS account has been created
              successfully.
            </p>


            <!-- ACCOUNT DETAILS -->

            <div
              style="
                background:#f9fafb;
                border:1px solid #e5e7eb;
                border-radius:10px;
                padding:22px;
                margin:20px 0;
              "
            >

              <h3
                style="
                  margin:0 0 16px;
                  font-size:17px;
                  color:#111827;
                "
              >
                Your Login Details
              </h3>


              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Name:</strong>
                ${user.name || ""}
              </p>


              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Email:</strong>
                ${user.email}
              </p>


              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Role:</strong>
                ${roleName}
              </p>


              <p
                style="
                  margin:8px 0;
                  font-size:14px;
                  color:#4b5563;
                "
              >
                <strong>Password:</strong>
                ${password}
              </p>

            </div>


            <!-- LOGIN BUTTON -->

            ${
              loginUrl
                ? `
                  <div
                    style="
                      margin:28px 0;
                    "
                  >

                    <a
                      href="${loginUrl}"
                      style="
                        display:inline-block;
                        padding:13px 24px;
                        background:#C91F26;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:7px;
                        font-size:14px;
                        font-weight:bold;
                      "
                    >
                      Login to GMT LMS
                    </a>

                  </div>
                `
                : ""
            }


            <!-- SECURITY WARNING -->

            <div
              style="
                margin-top:24px;
                padding:16px;
                background:#fff7ed;
                border:1px solid #fed7aa;
                border-radius:8px;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:13px;
                  line-height:1.6;
                  color:#9a3412;
                "
              >
                <strong>Security Notice:</strong>
                Please change your password after your
                first login and do not share your login
                credentials with anyone.
              </p>

            </div>


            <p
              style="
                margin:24px 0 0;
                font-size:14px;
                line-height:1.7;
                color:#6b7280;
              "
            >
              If you did not expect this account to be
              created, please contact the GMT LMS
              administrator.
            </p>

          </div>


          <!-- FOOTER -->

          <div
            style="
              padding:20px 32px;
              border-top:1px solid #e5e7eb;
              background:#fafafa;
            "
          >

            <p
              style="
                margin:0;
                font-size:12px;
                color:#9ca3af;
              "
            >
              GMT LMS Team
            </p>

          </div>

        </div>

      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Welcome to GMT LMS - Your Account Details",
      html,
    });

    return {
      sent: true,
      error: null,
    };

  } catch (error) {

    console.error(
      "Send account creation email error:",
      error
    );

    return {
      sent: false,
      error: error.message,
    };
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  createNotification,
  sendNotificationEmail,
  sendAccountCreationEmail,

  notifyUser,
  notifyUsers,
  notifyUsersByRole,

  markNotificationAsRead,
  markAllNotificationsAsRead,

  getUserNotifications,
  getUnreadNotificationCount,

  getNotificationPreferences,
  shouldSendEmail,
};