const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

// ==========================================
// STUDENT SUBMITS ASSIGNMENT
// POST /api/submissions
// ==========================================
const submitAssignment = async (req, res) => {
  try {
    const {
      course,
      assignment,
      description,
    } = req.body;

    // ==========================================
    // VALIDATE ASSIGNMENT
    // ==========================================

    if (!assignment) {
      return res.status(400).json({
        message: "Assignment is required.",
      });
    }

    // ==========================================
    // PREVENT DUPLICATE SUBMISSIONS
    // ==========================================

    const existingSubmission =
      await Submission.findOne({
        student: req.user._id,
        assignment,
      });

    if (existingSubmission) {
      return res.status(400).json({
        message:
          "You have already submitted this assignment.",
      });
    }

    // ==========================================
    // CREATE SUBMISSION
    // ==========================================

    const submission =
      await Submission.create({
        student: req.user._id,
        course,
        assignment,
        description,
        file: req.file
          ? req.file.filename
          : "",
      });

    res.status(201).json({
      message:
        "Assignment submitted successfully.",
      submission,
    });
  } catch (error) {
    console.error(
      "Submit assignment error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// STUDENT GETS THEIR SUBMISSIONS
// GET /api/submissions/my
// ==========================================
const getMySubmissions = async (
  req,
  res
) => {
  try {
    const submissions =
      await Submission.find({
        student: req.user._id,
      })
        .populate(
          "course",
          "title"
        )
        .populate(
          "assignment",
          "title dueDate totalMarks"
        )
        .sort({
          createdAt: -1,
        });

    res.json(submissions);
  } catch (error) {
    console.error(
      "Get student submissions error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// ADMIN GETS ALL SUBMISSIONS
// GET /api/submissions
// ==========================================
const getAllSubmissions = async (
  req,
  res
) => {
  try {
    const submissions =
      await Submission.find()
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "title"
        )
        .populate(
          "assignment",
          "title dueDate totalMarks"
        )
        .sort({
          createdAt: -1,
        });

    res.json(submissions);
  } catch (error) {
    console.error(
      "Get all submissions error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// ADMIN GRADES SUBMISSION
// PUT /api/submissions/:id
// ==========================================
const gradeSubmission = async (
  req,
  res
) => {
  try {
    const submission =
      await Submission.findById(
        req.params.id
      );

    if (!submission) {
      return res.status(404).json({
        message:
          "Submission not found.",
      });
    }

    submission.score =
      req.body.score;

    submission.feedback =
      req.body.feedback;

    submission.status =
      "Graded";

    submission.gradedBy =
      req.user._id;

    submission.gradedAt =
      new Date();

    await submission.save();

    res.json({
      message:
        "Submission graded successfully.",
      submission,
    });
  } catch (error) {
    console.error(
      "Grade submission error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL ACADEMY ASSIGNMENTS
// GET /api/submissions/academy
// ==========================================
const getAcademyAssignments = async (
  req,
  res
) => {
  try {
    const assignments =
      await Assignment.find({
        status: "Active",
      })
        .populate(
          "course",
          "title"
        )
        .sort({
          dueDate: 1,
        });

    res.json(assignments);
  } catch (error) {
    console.error(
      "Get academy assignments error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// DELETE SUBMISSION
// DELETE /api/submissions/:id
// ==========================================
const deleteSubmission = async (
  req,
  res
) => {
  try {
    const submission =
      await Submission.findById(
        req.params.id
      );

    if (!submission) {
      return res.status(404).json({
        message:
          "Submission not found.",
      });
    }

    await submission.deleteOne();

    res.json({
      message:
        "Submission deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete submission error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// INSTRUCTOR GETS STUDENT SUBMISSIONS
// GET /api/submissions/instructor
// =====================================================

const getInstructorSubmissions = async (req, res) => {
  try {

    console.log(
      "========== INSTRUCTOR SUBMISSIONS =========="
    );

    console.log(
      "Instructor ID:",
      req.user._id
    );

    // ==========================================
    // 1. FIND INSTRUCTOR'S COURSES
    // ==========================================

    const instructorCourses = await Course.find({
      instructorUser: req.user._id,
    }).select("_id title");

    console.log(
      "Instructor Courses:",
      instructorCourses
    );

    // ==========================================
    // 2. GET COURSE IDS
    // ==========================================

    const courseIds = instructorCourses.map(
      (course) => course._id
    );

    console.log(
      "Instructor Course IDs:",
      courseIds
    );

    // ==========================================
    // 3. FIND ASSIGNMENTS FOR THOSE COURSES
    // ==========================================

    const instructorAssignments =
      await Assignment.find({
        course: {
          $in: courseIds,
        },
      }).select(
        "_id title course totalMarks"
      );

    console.log(
      "Instructor Assignments:",
      instructorAssignments
    );

    // ==========================================
    // 4. GET ASSIGNMENT IDS
    // ==========================================

    const assignmentIds =
      instructorAssignments.map(
        (assignment) =>
          assignment._id
      );

    console.log(
      "Instructor Assignment IDs:",
      assignmentIds
    );

    // ==========================================
    // 5. FIND STUDENT SUBMISSIONS
    // ==========================================

    const submissions =
      await Submission.find({
        assignment: {
          $in: assignmentIds,
        },
      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "title code category"
        )
        .populate(
          "assignment",
          "title description dueDate totalMarks submissionType status"
        )
        .sort({
          createdAt: -1,
        });

    // ==========================================
    // 6. DEBUG
    // ==========================================

    console.log(
      "Instructor Submissions Found:",
      submissions.length
    );

    console.log(
      "Submissions:",
      submissions
    );

    // ==========================================
    // 7. RETURN
    // ==========================================

    res.json(submissions);

  } catch (error) {

    console.error(
      "Instructor submissions error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });

  }
};


const gradeInstructorSubmission = async (
  req,
  res
) => {
  try {

    // ==========================================
    // 1. FIND SUBMISSION
    // ==========================================

    const submission =
      await Submission.findById(
        req.params.id
      );

    if (!submission) {
      return res.status(404).json({
        message:
          "Submission not found.",
      });
    }

    // ==========================================
    // 2. FIND COURSE
    // ==========================================

    const course =
      await Course.findById(
        submission.course
      );

    if (!course) {
      return res.status(404).json({
        message:
          "Course associated with submission not found.",
      });
    }

    // ==========================================
    // 3. VERIFY INSTRUCTOR OWNS COURSE
    // ==========================================

    if (
      !course.instructorUser ||
      course.instructorUser.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to grade this submission.",
      });
    }

    // ==========================================
    // 4. GET SCORE + FEEDBACK
    // ==========================================

    const {
      score,
      feedback,
    } = req.body;

    // ==========================================
    // 5. VALIDATE SCORE
    // ==========================================

    if (
      score === undefined ||
      score === null ||
      score === ""
    ) {
      return res.status(400).json({
        message:
          "Score is required.",
      });
    }

    const numericScore =
      Number(score);

    if (
      Number.isNaN(numericScore)
    ) {
      return res.status(400).json({
        message:
          "Score must be a valid number.",
      });
    }

    // ==========================================
    // 6. GET ASSIGNMENT
    // ==========================================

    const assignment =
      await Assignment.findById(
        submission.assignment
      );

    if (!assignment) {
      return res.status(404).json({
        message:
          "Assignment not found.",
      });
    }

    // ==========================================
    // 7. VALIDATE SCORE AGAINST TOTAL MARKS
    // ==========================================

    if (
      numericScore < 0 ||
      numericScore >
        assignment.totalMarks
    ) {
      return res.status(400).json({
        message:
          `Score must be between 0 and ${assignment.totalMarks}.`,
      });
    }

    // ==========================================
    // 8. UPDATE SUBMISSION
    // ==========================================

    submission.score =
      numericScore;

    submission.feedback =
      feedback || "";

    submission.status =
      "Graded";

    submission.gradedBy =
      req.user._id;

    submission.gradedAt =
      new Date();

    await submission.save();

    // ==========================================
    // 9. GET UPDATED SUBMISSION
    // ==========================================

    const updatedSubmission =
      await Submission.findById(
        submission._id
      )
        .populate(
          "student",
          "name email"
        )
        .populate(
          "course",
          "title code category"
        )
        .populate(
          "assignment",
          "title description dueDate totalMarks submissionType status"
        );

    // ==========================================
    // 10. RESPONSE
    // ==========================================

    res.json({
      message:
        "Submission graded successfully.",

      submission:
        updatedSubmission,
    });

  } catch (error) {

    console.error(
      "Instructor grade submission error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  submitAssignment,
  getMySubmissions,
  getAllSubmissions,
  gradeSubmission,
  deleteSubmission,
  getAcademyAssignments,

  // Instructor
  getInstructorSubmissions,
  gradeInstructorSubmission,
};