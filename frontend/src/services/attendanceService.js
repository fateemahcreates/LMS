import api from "./api";

// ==========================================
// GET STUDENT ATTENDANCE
// GET /api/attendance/student/:studentId
// ==========================================

export const getStudentAttendance = async (studentId) => {
  const response = await api.get(
    `/attendance/student/${studentId}`
  );

  return response.data;
};