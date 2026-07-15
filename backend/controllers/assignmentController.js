const Assignment = require("../models/Assignment");

// =======================================
// CREATE ASSIGNMENT
// =======================================
const createAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);

    res.status(201).json({
      message: "Assignment created successfully.",
      assignment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// GET ALL ASSIGNMENTS
// =======================================
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("course", "title code")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// GET SINGLE ASSIGNMENT
// =======================================
const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("course", "title code");

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    res.json(assignment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// UPDATE ASSIGNMENT
// =======================================
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    res.json({
      message: "Assignment updated successfully.",
      assignment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================================
// DELETE ASSIGNMENT
// =======================================
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    await assignment.deleteOne();

    res.json({
      message: "Assignment deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};