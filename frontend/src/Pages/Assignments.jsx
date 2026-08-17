import { useEffect, useState } from "react";
import { notify } from "../utils/notify";

import AssignmentForm from "../components/AssignmentForm";
import AssignmentTable from "../components/AssignmentTable";
import AssignmentDetailsPanel from "../components/AssignmentDetailsPanel";
import SubmissionDetailsDrawer from "../components/SubmissionDetailsDrawer";

import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllSubmissions,
} from "../services/assignmentService";

import "../styles/Assignments.css";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [editingAssignment, setEditingAssignment] =
    useState(null);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

    const [selectedSubmission, setSelectedSubmission] =
  useState(null);

const [submissionDrawerOpen, setSubmissionDrawerOpen] =
  useState(false);

const handleReview = (submission) => {
  setSelectedSubmission(submission);
  setSubmissionDrawerOpen(true);
};
 

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

  // ==========================================
  // LOAD DATA
  // ==========================================

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments();
      setAssignments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await getAllSubmissions();
      setSubmissions(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  // ==========================================
  // INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ==========================================
// SAVE
// ==========================================

const handleSubmit = async (e) => {
  e.preventDefault();

  const isEditing = Boolean(editingAssignment);

  notify.confirmAction({

    title: isEditing
      ? "Update Assignment"
      : "Publish Assignment",

    message: isEditing
      ? "Are you sure you want to update this assignment?"
      : "Are you sure you want to publish this assignment?",

    confirmText: isEditing
      ? "Update"
      : "Publish",

    cancelText: "Cancel",

    type: isEditing
      ? "info"
      : "success",

    onConfirm: async () => {

      try {

        // ========================================
        // UPDATE ASSIGNMENT
        // ========================================

        if (editingAssignment) {

          await updateAssignment(
            editingAssignment._id,
            formData
          );

          notify.success(
            "Assignment updated successfully."
          );

        }

        // ========================================
        // CREATE / PUBLISH ASSIGNMENT
        // ========================================

        else {

          await createAssignment(
            formData
          );

          notify.success(
            "Assignment published successfully."
          );

        }

        // ========================================
        // RESET FORM
        // ========================================

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

        // ========================================
        // REFRESH DATA
        // ========================================

        fetchAssignments();
        fetchSubmissions();

      } catch (error) {

        console.error(
          "Assignment save error:",
          error
        );

        notify.apiError(error);

      }

    },

  });
};

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (assignment) => {

    setEditingAssignment(assignment);

    setFormData({
      title: assignment.title,
      description: assignment.description,
      course: assignment.course._id,
      dueDate:
        assignment.dueDate?.substring(0, 10),
      totalMarks:
        assignment.totalMarks,
      submissionType:
        assignment.submissionType,
      attachment:
        assignment.attachment,
      status: assignment.status,
    });

  };

  // ==========================================
// DELETE
// ==========================================

const handleDelete = (id) => {

  notify.confirmDelete(async () => {

    try {

      await deleteAssignment(id);

      notify.success(
        "Assignment deleted successfully."
      );

      // ========================================
      // REFRESH DATA
      // ========================================

      fetchAssignments();
      fetchSubmissions();

    } catch (error) {

      console.error(
        "Delete assignment error:",
        error
      );

      notify.apiError(error);

    }

  });

};

  // ==========================================
  // VIEW
  // ==========================================

  const handleView = (assignment) => {

  if (
    selectedAssignment?._id === assignment._id
  ) {

    setSelectedAssignment(null);

    return;

  }

  setSelectedAssignment(assignment);

};
  return (

    <main className="assignments-page">

      <div className="page-header">

        <h1>
          Assignment Management
        </h1>

        <p>
          Create and manage assignments
          for all academy courses.
        </p>

      </div>

      <AssignmentForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingAssignment={
          editingAssignment
        }
      />

      <AssignmentTable
  assignments={assignments}
  handleEdit={handleEdit}
  handleDelete={handleDelete}
  handleView={handleView}
  selectedAssignment={selectedAssignment}
/>

      {selectedAssignment && (

  <AssignmentDetailsPanel
    assignment={selectedAssignment}
    submissions={submissions.filter(
      (submission) =>
        submission.assignment?._id ===
        selectedAssignment._id
    )}
    onReview={handleReview}
  />

)}

<SubmissionDetailsDrawer
  open={submissionDrawerOpen}
  onClose={() =>
    setSubmissionDrawerOpen(false)
  }
  submission={selectedSubmission}
/>


    </main>

  );
}

export default Assignments;