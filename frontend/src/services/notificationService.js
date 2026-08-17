import api from "./api";

// ============================================================
// GET NOTIFICATIONS
// ============================================================

export const getNotifications = async (limit = 20) => {
  return await api.get(
    `/notifications?limit=${limit}`
  );
};


// ============================================================
// GET UNREAD NOTIFICATION COUNT
// ============================================================

export const getUnreadNotificationCount = async () => {
  return await api.get(
    "/notifications/unread-count"
  );
};


// ============================================================
// MARK ONE NOTIFICATION AS READ
// ============================================================

export const markNotificationAsRead = async (
  notificationId
) => {
  return await api.patch(
    `/notifications/${notificationId}/read`
  );
};


// ============================================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================================

export const markAllNotificationsAsRead = async () => {
  return await api.patch(
    "/notifications/read-all"
  );
};