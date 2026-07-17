import api from "./api";

// ==========================================
// GET ALL USERS
// ==========================================
export const getUsers = () => {
  return api.get("/users");
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
// DELETE USER
// ==========================================
export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};