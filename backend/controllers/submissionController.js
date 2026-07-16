const Submission = require("../models/Submission");

// ==========================================
// STUDENT SUBMITS ASSIGNMENT
// POST /api/submissions
// ==========================================
const submitAssignment = async (req, res) => {
  try {
    const {
      course,
      assignment,
      title,
      description,
    } = req.body;

    const submission = await Submission.create({
      student: req.user._id,
      course,
      assignment: assignment || null,
      title,
      description,
      file: req.file
        ? req.file.filename
        : "",
    });

    res.status(201).json({
      message: "Assignment submitted successfully.",
      submission,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// STUDENT GETS THEIR SUBMISSIONS
// GET /api/submissions/my
// ==========================================
const getMySubmissions = async (req, res) => {
  try {

    const submissions = await Submission.find({
      student: req.user._id,
    })
      .populate("course", "title")
      .populate("assignment", "title")
      .sort({
        createdAt: -1,
      });

    res.json(submissions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// ADMIN GETS ALL SUBMISSIONS
// GET /api/submissions
// ==========================================
const getAllSubmissions = async (req, res) => {

  try {

    const submissions = await Submission.find()

      .populate("student", "name email")

      .populate("course", "title")

      .populate("assignment", "title")

      .sort({
        createdAt: -1,
      });

    res.json(submissions);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// ADMIN GRADES SUBMISSION
// PUT /api/submissions/:id
// ==========================================
const gradeSubmission = async (req, res) => {

  try {

    const submission =
      await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({
        message: "Submission not found.",
      });

    }

    submission.score = req.body.score;

    submission.feedback = req.body.feedback;

    submission.status = "Graded";

    submission.gradedBy = req.user._id;

    submission.gradedAt = new Date();

    await submission.save();

    res.json({
      message: "Submission graded successfully.",
      submission,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// =======================================
// GET ALL ACADEMY ASSIGNMENTS
// =======================================

const Assignment = require("../models/Assignment");

const getAcademyAssignments = async (req, res) => {
  try {

    const assignments = await Assignment.find({
      status: "Active",
    })
      .populate("course", "title")
      .sort({ dueDate: 1 });

    res.json(assignments);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// DELETE SUBMISSION
// DELETE /api/submissions/:id
// ==========================================
const deleteSubmission = async (req, res) => {

  try {

    const submission =
      await Submission.findById(req.params.id);

    if (!submission) {

      return res.status(404).json({
        message: "Submission not found.",
      });

    }

    await submission.deleteOne();

    res.json({
      message: "Submission deleted successfully.",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  submitAssignment,
  getMySubmissions,
  getAllSubmissions,
  gradeSubmission,
  deleteSubmission,
  getAcademyAssignments,
};