import api from "./api";

// ===========================
// GET ALL ASSIGNMENTS
// ===========================

export const getAssignments = () =>
  api.get("/assignments");

// ===========================
// GET ONE ASSIGNMENT
// ===========================

export const getAssignment = (id) =>
  api.get(`/assignments/${id}`);

// ===========================
// CREATE
// ===========================

export const createAssignment = (data) =>
  api.post("/assignments", data);

// ===========================
// UPDATE
// ===========================

export const updateAssignment = (id, data) =>
  api.put(`/assignments/${id}`, data);

// ===========================
// DELETE
// ===========================

export const deleteAssignment = (id) =>
  api.delete(`/assignments/${id}`);