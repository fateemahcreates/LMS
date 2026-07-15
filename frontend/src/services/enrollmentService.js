import api from "./api";

// ==========================================
// ENROLL IN A COURSE
// POST /api/enrollments
// ==========================================
export const enrollCourse = (courseId) => {
  return api.post("/enrollments", {
    courseId,
  });
};

// ==========================================
// GET MY ENROLLED COURSES
// GET /api/enrollments/my
// ==========================================
export const getMyCourses = () => {
  return api.get("/enrollments/my");
};

export const continueLearning = (id) =>
    api.put(`/enrollments/continue/${id}`);

// ==========================================
// REMOVE ENROLLMENT
// DELETE /api/enrollments/:id
// ==========================================
export const removeEnrollment = (enrollmentId) => {
  return api.delete(`/enrollments/${enrollmentId}`);
};

export const approveCertificate = (id) =>
  api.put(`/enrollments/approve/${id}`);

export const getAllEnrollments = () =>
  api.get("/enrollments");