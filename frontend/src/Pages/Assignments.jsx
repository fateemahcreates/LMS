import { useEffect, useState } from "react";

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
      fetchSubmissions();

    } catch (error) {
      console.error(error);
      alert("Unable to save assignment.");
    }
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

  const handleDelete = async (id) => {

    if (!window.confirm(
      "Delete assignment?"
    ))
      return;

    await deleteAssignment(id);

    fetchAssignments();
    fetchSubmissions();

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