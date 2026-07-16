import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-backend.onrender.com/api",
});

export default api;