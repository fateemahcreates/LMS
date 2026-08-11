import api from "./api";

// ==========================================
// GET LATEST ACTIVITY
// ==========================================
export const getLatestActivity = async () => {
  return await api.get("/activity/latest");
};