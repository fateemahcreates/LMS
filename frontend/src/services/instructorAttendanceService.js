import api from "./api";

// ======================================================
// GET COURSE SESSIONS
// GET /api/attendance/sessions/course/:courseId
// ======================================================

export const getCourseSessions = async (courseId) => {
  try {
    const response = await api.get(
      `/attendance/sessions/course/${courseId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get course sessions error:",
      error
    );

    throw (
      error.response?.data || {
        message: "Unable to load class sessions.",
      }
    );
  }
};


// ======================================================
// CREATE CLASS SESSION
// POST /api/attendance/sessions
// Admin + Instructor
// ======================================================

export const createClassSession = async (data) => {
  try {
    const response = await api.post(
      "/attendance/sessions",
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
        message: "Unable to create class session.",
      }
    );
  }
};


// ======================================================
// GET ATTENDANCE ROSTER
// GET /api/attendance/sessions/:sessionId/roster
// ======================================================

export const getAttendanceRoster = async (
  sessionId
) => {
  try {
    const response = await api.get(
      `/attendance/sessions/${sessionId}/roster`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get attendance roster error:",
      error
    );

    throw (
      error.response?.data || {
        message: "Unable to load attendance roster.",
      }
    );
  }
};


// ======================================================
// OPEN ATTENDANCE
// PATCH /api/attendance/sessions/:sessionId/open
// ======================================================

export const openAttendance = async (
  sessionId
) => {
  try {
    const response = await api.patch(
      `/attendance/sessions/${sessionId}/open`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Open attendance error:",
      error
    );

    throw (
      error.response?.data || {
        message: "Unable to open attendance.",
      }
    );
  }
};


// ======================================================
// SAVE ATTENDANCE
// PUT /api/attendance/sessions/:sessionId
// ======================================================

export const saveAttendance = async (
  sessionId,
  attendance
) => {
  try {
    const response = await api.put(
      `/attendance/sessions/${sessionId}`,
      {
        attendance,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Save attendance error:",
      error
    );

    throw (
      error.response?.data || {
        message: "Unable to save attendance.",
      }
    );
  }
};


// ======================================================
// FINALIZE ATTENDANCE
// PATCH /api/attendance/sessions/:sessionId/finalize
// ======================================================

export const finalizeAttendance = async (
  sessionId
) => {
  try {
    const response = await api.patch(
      `/attendance/sessions/${sessionId}/finalize`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Finalize attendance error:",
      error
    );

    throw (
      error.response?.data || {
        message: "Unable to finalize attendance.",
      }
    );
  }
};