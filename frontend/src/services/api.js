import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-backend-g9mp.onrender.com",
});

export default api;