import API from "./api";

// ============================================================
// GET ALL SETTINGS
// ============================================================

export const getSettings = () => {
  return API.get("/settings");
};

// ============================================================
// UPDATE PROFILE
// ============================================================

export const updateProfile = (profileData) => {
  return API.put(
    "/settings/profile",
    profileData
  );
};

// ============================================================
// CHANGE PASSWORD
// ============================================================

export const changePassword = (passwordData) => {
  return API.put(
    "/settings/password",
    passwordData
  );
};

// ============================================================
// UPDATE NOTIFICATION PREFERENCES
// ============================================================

export const updateNotifications = (
  notificationData
) => {
  return API.put(
    "/settings/notifications",
    notificationData
  );
};

// ============================================================
// GET ACCOUNT INFORMATION
// ============================================================

export const getAccount = () => {
  return API.get("/settings/account");
};