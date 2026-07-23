import api from "./api";

// ==============================
// Register
// ==============================
export const register = (userData) => {
  return api.post("/auth/register", userData);
};

// ==============================
// Login
// ==============================
export const login = (userData) => {
  return api.post("/auth/login", userData);
};

// ==============================
// Forgot Password
// ==============================
export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", {
    email,
  });
};

// ==============================
// Reset Password
// ==============================
export const resetPassword = (
  token,
  password
) => {
  return api.put(
    `/auth/reset-password/${token}`,
    {
      password,
    }
  );
};