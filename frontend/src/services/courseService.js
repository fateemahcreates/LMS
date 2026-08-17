import api from "./api";

// ==========================================
// GET ALL COURSES
// ==========================================
export const getCourses = () =>
  api.get("/courses");


// ==========================================
// GET PUBLISHED COURSES
// ==========================================
export const getPublishedCourses = () =>
  api.get("/courses/published");


// ==========================================
// GET INSTRUCTOR'S COURSES
// ==========================================
// GET /api/courses/my-courses
// Instructor only
// ==========================================
export const getInstructorCourses = async () => {
  const response = await api.get(
    "/courses/my-courses"
  );

  return response.data;
};


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