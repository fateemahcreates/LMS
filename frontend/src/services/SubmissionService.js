import api from "./api";

// ==========================================
// STUDENT
// ==========================================

// ==========================================
// SUBMIT ASSIGNMENT
// POST /api/submissions
// ==========================================

export const submitAssignment = (formData) => {
  return api.post(
    "/submissions",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ==========================================
// GET MY SUBMISSIONS
// GET /api/submissions/my
// ==========================================

export const getMySubmissions = () => {
  return api.get("/submissions/my");
};

// ==========================================
// GET STUDENT ACADEMY ASSIGNMENTS
// GET /api/submissions/academy
// ==========================================

export const getAcademyAssignments = () => {
  return api.get("/submissions/academy");
};

// ==========================================
// ADMIN
// ==========================================

// ==========================================
// GET ALL SUBMISSIONS
// GET /api/submissions
// ==========================================

export const getAllSubmissions = () => {
  return api.get("/submissions");
};

// ==========================================
// ADMIN GRADE SUBMISSION
// PUT /api/submissions/:id
// ==========================================

export const gradeSubmission = (id, data) => {
  return api.put(
    `/submissions/${id}`,
    data
  );
};

// ==========================================
// DELETE SUBMISSION
// DELETE /api/submissions/:id
// ==========================================

export const deleteSubmission = (id) => {
  return api.delete(
    `/submissions/${id}`
  );
};

// ==========================================
// INSTRUCTOR
// ==========================================

// ==========================================
// GET INSTRUCTOR SUBMISSIONS
// GET /api/submissions/instructor
// ==========================================

export const getInstructorSubmissions = () => {
  return api.get(
    "/submissions/instructor"
  );
};

// ==========================================
// GRADE STUDENT SUBMISSION
// PUT /api/submissions/instructor/:id
// ==========================================

export const gradeInstructorSubmission = (
  id,
  data
) => {
  return api.put(
    `/submissions/instructor/${id}`,
    data
  );
};