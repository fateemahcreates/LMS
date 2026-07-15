import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// ==========================================
// Axios Instance
// Automatically attaches JWT token
// ==========================================
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================================
// GET ALL USERS
// ==========================================
export const getUsers = () => {
  return api.get("/");
};

// ==========================================
// CREATE USER
// ==========================================
export const createUser = (data) => {
  return api.post("/", data);
};

// ==========================================
// UPDATE USER
// ==========================================
export const updateUser = (id, data) => {
  return api.put(`/${id}`, data);
};

// ==========================================
// DELETE USER
// ==========================================
export const deleteUser = (id) => {
  return api.delete(`/${id}`);
};