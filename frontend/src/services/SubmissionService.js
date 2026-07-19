import api from "./api";

// ===============================
// SUBMIT ASSIGNMENT
// ===============================

export const submitAssignment = (formData) =>
  api.post("/submissions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ===============================
// GET MY SUBMISSIONS
// ===============================

export const getMySubmissions = () =>
  api.get("/submissions/my");

export const getAcademyAssignments = () =>
  api.get("/submissions/academy");

export const getAllSubmissions = () =>
  api.get("/submissions");