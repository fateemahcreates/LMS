import api from "./api";


// ==========================================
// GET ALL ASSIGNMENTS
// ==========================================
export const getAssignments = () => {
  return api.get("/assignments");
};


// ==========================================
// GET SINGLE ASSIGNMENT
// ==========================================
export const getAssignmentById = (id) => {
  return api.get(`/assignments/${id}`);
};


// ==========================================
// CREATE ASSIGNMENT
// ==========================================
export const createAssignment = (data) => {
  return api.post("/assignments", data);
};


// ==========================================
// UPDATE ASSIGNMENT
// ==========================================
export const updateAssignment = (id, data) => {
  return api.put(
    `/assignments/${id}`,
    data
  );
};


// ==========================================
// DELETE ASSIGNMENT
// ==========================================
export const deleteAssignment = (id) => {
  return api.delete(
    `/assignments/${id}`
  );
};


// ==========================================
// STUDENT UPCOMING DEADLINES
// ==========================================
export const getUpcomingDeadlines = () => {
  return api.get(
    "/assignments/upcoming"
  );
};


// ==========================================
// STUDENT ASSIGNMENTS
// ==========================================
export const getStudentAssignments = () => {
  return api.get(
    "/assignments/student"
  );
};


// ==========================================
// GET ALL SUBMISSIONS (ADMIN)
// ==========================================
export const getAllSubmissions = () => {
  return api.get(
    "/submissions"
  );
};

// ==========================================
// INSTRUCTOR ASSIGNMENTS
// ==========================================

export const getInstructorAssignments = () => {
  return api.get("/assignments/instructor");
};

export const createInstructorAssignment = (data) => {
  return api.post(
    "/assignments/instructor",
    data
  );
};

export const updateInstructorAssignment = (id, data) => {
  return api.put(
    `/assignments/instructor/${id}`,
    data
  );
};

export const deleteInstructorAssignment = (id) => {
  return api.delete(
    `/assignments/instructor/${id}`
  );
};