import api from "./api";

// =======================================
// GET ALL ANNOUNCEMENTS
// =======================================

export const getAnnouncements = () => {
  return api.get("/announcements");
};

// =======================================
// GET SINGLE ANNOUNCEMENT
// =======================================

export const getAnnouncement = (id) => {
  return api.get(`/announcements/${id}`);
};

// =======================================
// CREATE ANNOUNCEMENT
// =======================================

export const createAnnouncement = (announcementData) => {
  return api.post("/announcements", announcementData);
};

// =======================================
// UPDATE ANNOUNCEMENT
// =======================================

export const updateAnnouncement = (id, announcementData) => {
  return api.put(`/announcements/${id}`, announcementData);
};

// =======================================
// DELETE ANNOUNCEMENT
// =======================================

export const deleteAnnouncement = (id) => {
  return api.delete(`/announcements/${id}`);
};

// =======================================
// PIN / UNPIN ANNOUNCEMENT
// =======================================

export const togglePinAnnouncement = (id) => {
  return api.patch(`/announcements/${id}/pin`);
};