const Assignment = require("../models/Assignment");
const Enrollment = require("../models/Enrollment");

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
const getAssignmentById = async (req, res) => {
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

// ==========================================
// GET STUDENT ASSIGNMENTS
// GET /api/assignments/student
// Student Only
// ==========================================

const getStudentAssignments = async (req, res) => {

  try {


    // Find student's enrolled courses

    const enrollments = await Enrollment.find({
      student: req.user._id,
    });


    const courseIds = enrollments.map(
      (item) => item.course
    );


    // Find assignments for those courses

    const assignments =
      await Assignment.find({
        course:{
          $in: courseIds,
        },
      })
      .populate(
        "course",
        "title"
      )
      .sort({
        dueDate:1,
      });



    res.status(200).json(assignments);



  } catch(error){

    console.error(
      "Student Assignment Error:",
      error
    );


    res.status(500).json({
      message:error.message,
    });

  }

};
// ==========================================
// GET UPCOMING DEADLINES
// Student Only
// ==========================================
const getUpcomingDeadlines = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
      status: {
        $in: ["Enrolled", "In Progress"],
      },
    });

    const courseIds = enrollments.map(
      (item) => item.course
    );

    const assignments = await Assignment.find({
      course: { $in: courseIds },
      status: "Active",
      dueDate: { $gte: new Date() },
    })
      .populate("course", "title")
      .sort({ dueDate: 1 })
      .limit(5);

    const today = new Date();

    const data = assignments.map((assignment) => {
      const diff = Math.ceil(
        (new Date(assignment.dueDate) - today) /
          (1000 * 60 * 60 * 24)
      );

      let label = "";
      let priority = "";

      if (diff <= 0) {
        label = "Today";
        priority = "high";
      } else if (diff === 1) {
        label = "Tomorrow";
        priority = "high";
      } else if (diff <= 3) {
        label = `${diff} Days`;
        priority = "medium";
      } else {
        label = `${diff} Days`;
        priority = "low";
      }

      return {
        _id: assignment._id,
        title: assignment.title,
        course: assignment.course.title,
        due: new Date(
          assignment.dueDate
        ).toLocaleDateString(),
        label,
        priority,
      };
    });

    res.json(data);
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

  getAssignmentById,

  getStudentAssignments,

  updateAssignment,

  deleteAssignment,

  getUpcomingDeadlines,

};