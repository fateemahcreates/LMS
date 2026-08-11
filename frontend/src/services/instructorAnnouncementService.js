import API from "./api";

// ======================================
// Get Instructor Announcements
// ======================================

export const getInstructorAnnouncements = () => {
  return API.get("/announcements");
};


// ======================================
// Get Single Announcement
// ======================================

export const getInstructorAnnouncement = (id) => {
  return API.get(`/announcements/${id}`);
};


// ======================================
// Create Announcement
// ======================================

export const createInstructorAnnouncement = (data) => {
  return API.post("/announcements", data);
};


// ======================================
// Update Announcement
// ======================================

export const updateInstructorAnnouncement = (id, data) => {
  return API.put(`/announcements/${id}`, data);
};


// ======================================
// Delete Announcement
// ======================================

export const deleteInstructorAnnouncement = (id) => {
  return API.delete(`/announcements/${id}`);
};