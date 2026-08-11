import API from "./api";

// ======================================
// Instructor Dashboard
// ======================================

export const getInstructorDashboard = () => {
  return API.get("/instructor/dashboard");
};

export const getCourseDetails = (courseId) => {
  return API.get(`/courses/${courseId}`);
};

export const getInstructorCourses = () => {
  return API.get("/courses/my-courses");
};

// ======================================
// Get Students Inside Course
// ======================================

export const getCourseStudents = (courseId) => {
  return API.get(`/courses/${courseId}/students`);
};

export const getInstructorStudents = () => {
  return API.get("/instructor/students");
};