import api from "./api";

// GET ALL STUDENTS
export const getStudents = () =>
  api.get("/students");

// CREATE STUDENT
export const createStudent = (data) =>
  api.post("/students", data);

export const getStudentStats = () =>
  api.get("/students/stats");

// UPDATE STUDENT
export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data);

// DELETE STUDENT
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`);

// GET LOGGED-IN STUDENT PROFILE
export const getStudentProfile = () =>
  api.get("/students/profile");