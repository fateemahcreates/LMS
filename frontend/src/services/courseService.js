import api from "./api";

// ==========================================
// GET ALL COURSES
// ==========================================
export const getCourses = () =>
  api.get("/courses");

export const getPublishedCourses = () =>
  api.get("/courses/published");

// ==========================================
// CREATE COURSE
// ==========================================
export const createCourse = (data) =>
  api.post("/courses", data);

// ==========================================
// UPDATE COURSE
// ==========================================
export const updateCourse = (id, data) =>
  api.put(`/courses/${id}`, data);

// ==========================================
// DELETE COURSE
// ==========================================
export const deleteCourse = (id) =>
  api.delete(`/courses/${id}`);