const Notification = require("../models/Notification");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// ============================================================
// CREATE NOTIFICATION
// ============================================================
// Creates an in-app notification and optionally sends an email
// through Brevo.
//
// Works for:
// Admin
// Instructor
// Student
//
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
  sendEmailNotification = true,
}) => {
  try {
    // ========================================================
    // VALIDATION
    // ========================================================

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

    // ========================================================
    // FIND USER
    // ========================================================

    const user = await User.findById(recipient);

    if (!user) {
      throw new Error(
        "Notification recipient not found."
      );
    }

    // ========================================================
    // NOTIFICATION PREFERENCES
    // ========================================================

    const preferences =
      user.notificationPreferences || {};

    const emailNotifications =
      preferences.emailNotifications !== false;

    // ========================================================
    // CREATE IN-APP NOTIFICATION
    // ========================================================

    const notification =
      await Notification.create({
        recipient: user._id,

        type,

        title,

        message,

        link,

        relatedId,

        relatedModel,

        priority,

        isRead: false,

        emailSent: false,

        emailSentAt: null,

        emailError: "",
      });

    // ========================================================
    // SEND EMAIL
    // ========================================================

    if (
      sendEmailNotification &&
      emailNotifications &&
      user.email
    ) {
      try {
        const clientUrl =
          process.env.CLIENT_URL || "";

        const emailLink = link
          ? `${clientUrl}${link}`
          : "";

        // ====================================================
        // EMAIL TEMPLATE
        // ====================================================

        const emailHtml = `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>${title}</title>

</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f8f9fb;
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;
  "
>

<div
  style="
    max-width:600px;
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
    background:#c91f26;
    padding:25px 30px;
    text-align:center;
  "
>

<h1
  style="
    margin:0;
    color:#ffffff;
    font-size:24px;
  "
>
GMT LMS
</h1>

</div>


<!-- CONTENT -->

<div
  style="
    padding:35px 30px;
  "
>

<p
  style="
    margin:0 0 15px;
    font-size:16px;
  "
>
Hello ${user.name || "User"},
</p>


<h2
  style="
    margin:0 0 15px;
    font-size:22px;
    color:#111827;
  "
>
${title}
</h2>


<p
  style="
    margin:0 0 25px;
    font-size:15px;
    line-height:1.7;
    color:#4b5563;
  "
>
${message}
</p>


${
  emailLink
    ? `
<div
  style="
    text-align:center;
    margin:30px 0;
  "
>

<a
  href="${emailLink}"
  style="
    display:inline-block;
    padding:13px 24px;
    background:#c91f26;
    color:#ffffff;
    text-decoration:none;
    border-radius:7px;
    font-size:14px;
    font-weight:bold;
  "
>
View in GMT LMS
</a>

</div>
`
    : ""
}


<p
  style="
    margin-top:30px;
    font-size:13px;
    line-height:1.6;
    color:#6b7280;
  "
>
You are receiving this email because notifications
are enabled for your GMT LMS account.
</p>

</div>


<!-- FOOTER -->

<div
  style="
    padding:20px 30px;
    background:#f8f9fb;
    border-top:1px solid #e5e7eb;
    text-align:center;
  "
>

<p
  style="
    margin:0;
    font-size:12px;
    color:#6b7280;
  "
>
© ${new Date().getFullYear()}
GMT LMS. All rights reserved.
</p>

</div>

</div>

</body>

</html>
`;

        // ====================================================
        // BREVO
        // ====================================================

        await sendEmail({
          to: user.email,
          subject: `GMT LMS: ${title}`,
          html: emailHtml,
        });

        // ====================================================
        // EMAIL SUCCESS
        // ====================================================

        notification.emailSent = true;

        notification.emailSentAt =
          new Date();

        notification.emailError = "";

        await notification.save();

        console.log(
          `Notification email sent to ${user.email}`
        );

      } catch (emailError) {

        // ====================================================
        // EMAIL FAILED
        // ====================================================

        console.error(
          "Notification email failed:",
          emailError.message
        );

        notification.emailSent = false;

        notification.emailSentAt = null;

        notification.emailError =
          emailError.message ||
          "Email sending failed.";

        await notification.save();

        // Do NOT throw here.
        //
        // The in-app notification has already been
        // successfully created.
      }
    }

    // ========================================================
    // EMAIL DISABLED
    // ========================================================

    if (
      !sendEmailNotification ||
      !emailNotifications
    ) {
      console.log(
        `Notification email skipped for ${user.email}`
      );
    }

    // ========================================================
    // RETURN
    // ========================================================

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
// CREATE BULK NOTIFICATIONS
// ============================================================
// Used when one event affects multiple users.
//
// Example:
// New announcement → notify all students.
// ============================================================

const createBulkNotifications = async ({
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

    for (
      const recipient of recipients
    ) {

      try {

        const notification =
          await createNotification({
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

        notifications.push(
          notification
        );

      } catch (error) {

        console.error(
          `Failed to notify ${recipient}:`,
          error.message
        );
      }
    }

    return notifications;

  } catch (error) {

    console.error(
      "Create bulk notifications error:",
      error
    );

    throw error;
  }
};


// ============================================================
// GET USER NOTIFICATIONS
// ============================================================
// Returns newest notifications first.
//
// Security:
// Only notifications belonging to the authenticated user
// should ever be returned.
// ============================================================

const getUserNotifications = async (
  userId,
  limit = 20
) => {
  try {

    console.log("========================================");
    console.log("GET USER NOTIFICATIONS SERVICE");
    console.log("Received userId:", userId);
    console.log(
      "Received userId type:",
      typeof userId
    );
    console.log("========================================");

    // ========================================================
    // LIMIT
    // ========================================================

    const safeLimit = Math.min(
      Math.max(
        Number(limit) || 20,
        1
      ),
      100
    );

    // ========================================================
    // FIND NOTIFICATIONS
    // ========================================================

    const notifications =
      await Notification.find({
        recipient: userId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(safeLimit)
        .populate("relatedId");

    // ========================================================
    // DEBUG RESULT
    // ========================================================

    console.log(
      "Notifications found:",
      notifications.length
    );

    if (notifications.length > 0) {

      console.log(
        "First notification recipient:",
        notifications[0].recipient
      );

      console.log(
        "First notification title:",
        notifications[0].title
      );

      console.log(
        "First notification type:",
        notifications[0].type
      );
    }

    console.log("========================================");

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
// GET UNREAD NOTIFICATION COUNT
// ============================================================

const getUnreadNotificationCount = async (
  userId
) => {

  try {

    const count =
      await Notification.countDocuments({
        recipient: userId,

        isRead: false,
      });

    return count;

  } catch (error) {

    console.error(
      "Get unread notification count error:",
      error
    );

    throw error;
  }
};


// ============================================================
// MARK ONE NOTIFICATION AS READ
// ============================================================
// IMPORTANT:
// We check BOTH _id and recipient.
//
// This prevents User A from marking User B's notification
// as read.
// ============================================================

const markNotificationAsRead = async (
  notificationId,
  userId
) => {

  try {

    const notification =
      await Notification.findOne({
        _id: notificationId,

        recipient: userId,
      });

    if (!notification) {
      return null;
    }

    if (!notification.isRead) {

      notification.isRead = true;

      notification.readAt =
        new Date();

      await notification.save();
    }

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

const markAllNotificationsAsRead = async (
  userId
) => {

  try {

    const result =
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

    return result;

  } catch (error) {

    console.error(
      "Mark all notifications as read error:",
      error
    );

    throw error;
  }
};


// ============================================================
// NOTIFY ONE USER
// ============================================================

const notifyUser = async (
  options
) => {

  return createNotification(
    options
  );
};


// ============================================================
// NOTIFY MULTIPLE USERS
// ============================================================

const notifyUsers = async (
  options
) => {

  return createBulkNotifications(
    options
  );
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {

  // Creation
  createNotification,

  createBulkNotifications,

  notifyUser,

  notifyUsers,

  // Retrieval
  getUserNotifications,

  getUnreadNotificationCount,

  // Read status
  markNotificationAsRead,

  markAllNotificationsAsRead,
};