import api from "./api";

// ======================================================
// CREATE CLASS SESSION
// POST /api/class-sessions
// Admin + Instructor
// ======================================================

export const createClassSession = async (data) => {
  try {
    const response = await api.post(
      "/class-sessions",
      data
    );

    return response.data;

  } catch (error) {

    console.error(
      "Create class session error:",
      error
    );

    throw (
      error.response?.data || {
        message:
          "Unable to create class session.",
      }
    );
  }
};