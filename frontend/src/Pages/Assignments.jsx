import { useEffect, useState } from "react";

import AssignmentForm from "../components/AssignmentForm";
import AssignmentTable from "../components/AssignmentTable";

import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../services/assignmentService";

import "../styles/Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    dueDate: "",
    totalMarks: 100,
    submissionType: "Online",
    attachment: "",
    status: "Active",
  });

  // ==========================
  // Load Assignments
  // ==========================

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments();
      setAssignments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Submit
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingAssignment) {
        await updateAssignment(
          editingAssignment._id,
          formData
        );
      } else {
        await createAssignment(formData);
      }

      setFormData({
        title: "",
        description: "",
        course: "",
        dueDate: "",
        totalMarks: 100,
        submissionType: "Online",
        attachment: "",
        status: "Active",
      });

      setEditingAssignment(null);

      fetchAssignments();

    } catch (error) {
      console.error(error);
      alert("Unable to save assignment.");
    }
  };

  // ==========================
  // Edit
  // ==========================

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);

    setFormData({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course._id,
      dueDate: assignment.dueDate?.substring(0, 10),
      totalMarks: assignment.totalMarks,
      submissionType: assignment.submissionType,
      attachment: assignment.attachment,
      status: assignment.status,
    });
  };

  // ==========================
  // Delete
  // ==========================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete assignment?")) return;

    await deleteAssignment(id);

    fetchAssignments();
  };

  return (
    <main className="assignments-page">

      <div className="page-header">

        <h1>Assignment Management</h1>

        <p>
          Create and manage assignments for all academy courses.
        </p>

      </div>

      <AssignmentForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingAssignment={editingAssignment}
      />

      <AssignmentTable
        assignments={assignments}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

    </main>
  );
}

export default Assignments;