import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    console.log(
      "========== AXIOS REQUEST =========="
    );

    console.log(
      "TOKEN:",
      token
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log(
      "HEADERS:",
      config.headers
    );

    console.log(
      "BASE URL:",
      config.baseURL
    );

    console.log(
      "URL:",
      config.url
    );

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(

  (response) => {
    return response;
  },

  (error) => {

    console.log(
      "========== AXIOS RESPONSE ERROR =========="
    );

    console.log(
      "STATUS:",
      error.response?.status
    );

    console.log(
      "URL:",
      error.config?.url
    );

    console.log(
      "METHOD:",
      error.config?.method
    );

    console.log(
      "DATA:",
      error.response?.data
    );

    console.log(
      "MESSAGE:",
      error.message
    );

    return Promise.reject(error);
  }

);


export default api;