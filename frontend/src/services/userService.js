import api from "./api";

// ==========================================
// GET ALL USERS
// ==========================================
export const getUsers = () => {
  return api.get("/users");
};

// ==========================================
// GET SINGLE USER
// ==========================================
export const getUser = (id) => {
  return api.get(`/users/${id}`);
};

// ==========================================
// CREATE USER
// ==========================================
export const createUser = (data) => {
  return api.post("/users", data);
};

// ==========================================
// UPDATE USER
// ==========================================
export const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data);
};

// ==========================================
// CHANGE USER ROLE
// ==========================================
export const changeUserRole = (id, role) => {
  return api.patch(`/users/${id}/role`, {
    role,
  });
};

// ==========================================
// CHANGE USER STATUS
// ==========================================
export const changeUserStatus = (id, status) => {
  return api.patch(`/users/${id}/status`, {
    status,
  });
};

// ==========================================
// GET INSTRUCTORS
// ==========================================

export const getInstructors = () => {
  return api.get("/users/instructors");
};

// ==========================================
// DELETE USER
// ==========================================
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};