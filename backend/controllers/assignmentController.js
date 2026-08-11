const Assignment = require("../models/Assignment");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// =======================================
// CREATE ASSIGNMENT
// ADMIN
// =======================================

const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      course,
      dueDate,
      totalMarks,
      submissionType,
      attachment,
      status,
    } = req.body;

    // ---------------------------------------
    // Validate required fields
    // ---------------------------------------

    if (!title || !course || !dueDate) {
      return res.status(400).json({
        message: "Title, course and due date are required.",
      });
    }

    // ---------------------------------------
    // Check course exists
    // ---------------------------------------

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // ---------------------------------------
    // Create assignment
    // ---------------------------------------

    const assignment = await Assignment.create({
      title,
      description: description || "",
      course,
      dueDate,
      totalMarks: totalMarks || 100,
      submissionType: submissionType || "Online",
      attachment: attachment || "",
      status: status || "Active",
    });

    // ---------------------------------------
    // Update course assignment count
    // ---------------------------------------

    await Course.findByIdAndUpdate(course, {
      $inc: {
        totalAssignments: 1,
      },
    });

    // ---------------------------------------
    // Return populated assignment
    // ---------------------------------------

    const populatedAssignment =
      await Assignment.findById(assignment._id)
        .populate("course", "title code");

    res.status(201).json({
      message: "Assignment created successfully.",
      assignment: populatedAssignment,
    });

  } catch (error) {
    console.error("CREATE ASSIGNMENT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// CREATE ASSIGNMENT - INSTRUCTOR
// Instructor can only create for own course
// =======================================

const createInstructorAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      course,
      dueDate,
      totalMarks,
      submissionType,
      attachment,
      status,
    } = req.body;

    // ---------------------------------------
    // Validate fields
    // ---------------------------------------

    if (!title || !course || !dueDate) {
      return res.status(400).json({
        message: "Title, course and due date are required.",
      });
    }

    // ---------------------------------------
    // Find course
    // ---------------------------------------

    const existingCourse = await Course.findById(course);

    if (!existingCourse) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // ---------------------------------------
    // Check instructor owns the course
    // ---------------------------------------

    if (
      !existingCourse.instructorUser ||
      existingCourse.instructorUser.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only create assignments for courses assigned to you.",
      });
    }

    // ---------------------------------------
    // Create assignment
    // ---------------------------------------

    const assignment = await Assignment.create({
      title,
      description: description || "",
      course,
      dueDate,
      totalMarks: totalMarks || 100,
      submissionType: submissionType || "Online",
      attachment: attachment || "",
      status: status || "Active",
    });

    // ---------------------------------------
    // Update course assignment count
    // ---------------------------------------

    await Course.findByIdAndUpdate(course, {
      $inc: {
        totalAssignments: 1,
      },
    });

    // ---------------------------------------
    // Populate course
    // ---------------------------------------

    const populatedAssignment =
      await Assignment.findById(assignment._id)
        .populate("course", "title code");

    res.status(201).json({
      message: "Assignment created successfully.",
      assignment: populatedAssignment,
    });

  } catch (error) {
    console.error(
      "CREATE INSTRUCTOR ASSIGNMENT ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// GET ALL ASSIGNMENTS
// ADMIN
// =======================================

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("course", "title code")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(assignments);

  } catch (error) {
    console.error(
      "GET ASSIGNMENTS ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// GET INSTRUCTOR ASSIGNMENTS
// =======================================

const getInstructorAssignments = async (req, res) => {
  try {
    // ---------------------------------------
    // Find courses assigned to instructor
    // ---------------------------------------

    const courses = await Course.find({
      instructorUser: req.user._id,
    }).select("_id title code");

    const courseIds = courses.map(
      (course) => course._id
    );

    // ---------------------------------------
    // Find assignments belonging to those
    // courses
    // ---------------------------------------

    const assignments = await Assignment.find({
      course: {
        $in: courseIds,
      },
    })
      .populate(
        "course",
        "title code category level"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(assignments);

  } catch (error) {
    console.error(
      "GET INSTRUCTOR ASSIGNMENTS ERROR:",
      error
    );

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
    const assignment =
      await Assignment.findById(req.params.id)
        .populate("course", "title code");

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    res.status(200).json(assignment);

  } catch (error) {
    console.error(
      "GET ASSIGNMENT ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// UPDATE ASSIGNMENT
// ADMIN
// =======================================

const updateAssignment = async (req, res) => {
  try {
    const assignment =
      await Assignment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("course", "title code");

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    res.status(200).json({
      message: "Assignment updated successfully.",
      assignment,
    });

  } catch (error) {
    console.error(
      "UPDATE ASSIGNMENT ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// UPDATE ASSIGNMENT
// INSTRUCTOR
// =======================================

const updateInstructorAssignment = async (
  req,
  res
) => {
  try {
    const assignment =
      await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    // ---------------------------------------
    // Find course
    // ---------------------------------------

    const course = await Course.findById(
      assignment.course
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // ---------------------------------------
    // Check ownership
    // ---------------------------------------

    if (
      !course.instructorUser ||
      course.instructorUser.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only update assignments for your own courses.",
      });
    }

    // ---------------------------------------
    // Update
    // ---------------------------------------

    Object.assign(
      assignment,
      req.body
    );

    await assignment.save();

    const updatedAssignment =
      await Assignment.findById(
        assignment._id
      ).populate(
        "course",
        "title code"
      );

    res.status(200).json({
      message:
        "Assignment updated successfully.",
      assignment: updatedAssignment,
    });

  } catch (error) {
    console.error(
      "UPDATE INSTRUCTOR ASSIGNMENT ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// DELETE ASSIGNMENT
// ADMIN
// =======================================

const deleteAssignment = async (req, res) => {
  try {
    const assignment =
      await Assignment.findById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    const courseId = assignment.course;

    await assignment.deleteOne();

    // ---------------------------------------
    // Decrease course assignment count
    // ---------------------------------------

    await Course.findByIdAndUpdate(
      courseId,
      {
        $inc: {
          totalAssignments: -1,
        },
      }
    );

    res.status(200).json({
      message:
        "Assignment deleted successfully.",
    });

  } catch (error) {
    console.error(
      "DELETE ASSIGNMENT ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// DELETE ASSIGNMENT
// INSTRUCTOR
// =======================================

const deleteInstructorAssignment =
  async (req, res) => {
    try {
      const assignment =
        await Assignment.findById(
          req.params.id
        );

      if (!assignment) {
        return res.status(404).json({
          message: "Assignment not found.",
        });
      }

      // ---------------------------------------
      // Find course
      // ---------------------------------------

      const course = await Course.findById(
        assignment.course
      );

      if (!course) {
        return res.status(404).json({
          message: "Course not found.",
        });
      }

      // ---------------------------------------
      // Check ownership
      // ---------------------------------------

      if (
        !course.instructorUser ||
        course.instructorUser.toString() !==
          req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You can only delete assignments for your own courses.",
        });
      }

      const courseId =
        assignment.course;

      await assignment.deleteOne();

      await Course.findByIdAndUpdate(
        courseId,
        {
          $inc: {
            totalAssignments: -1,
          },
        }
      );

      res.status(200).json({
        message:
          "Assignment deleted successfully.",
      });

    } catch (error) {
      console.error(
        "DELETE INSTRUCTOR ASSIGNMENT ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };


// ==========================================
// GET STUDENT ASSIGNMENTS
// GET /api/assignments/student
// ==========================================

const getStudentAssignments = async (
  req,
  res
) => {
  try {
    // ---------------------------------------
    // Find student's enrolled courses
    // ---------------------------------------

    const enrollments =
      await Enrollment.find({
        student: req.user._id,
        status: {
          $in: [
            "Enrolled",
            "In Progress",
            "Completed",
          ],
        },
      });

    const courseIds = enrollments.map(
      (item) => item.course
    );

    // ---------------------------------------
    // Find assignments
    // ---------------------------------------

    const assignments =
      await Assignment.find({
        course: {
          $in: courseIds,
        },
        status: "Active",
      })
        .populate(
          "course",
          "title code"
        )
        .sort({
          dueDate: 1,
        });

    res.status(200).json(assignments);

  } catch (error) {
    console.error(
      "STUDENT ASSIGNMENT ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// GET UPCOMING DEADLINES
// STUDENT ONLY
// ==========================================

const getUpcomingDeadlines = async (
  req,
  res
) => {
  try {
    const enrollments =
      await Enrollment.find({
        student: req.user._id,
        status: {
          $in: [
            "Enrolled",
            "In Progress",
          ],
        },
      });

    const courseIds =
      enrollments.map(
        (item) => item.course
      );

    const assignments =
      await Assignment.find({
        course: {
          $in: courseIds,
        },
        status: "Active",
        dueDate: {
          $gte: new Date(),
        },
      })
        .populate(
          "course",
          "title"
        )
        .sort({
          dueDate: 1,
        })
        .limit(5);

    const today = new Date();

    const data = assignments.map(
      (assignment) => {
        const diff = Math.ceil(
          (
            new Date(
              assignment.dueDate
            ) - today
          ) /
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
          course:
            assignment.course?.title ||
            "Unknown Course",
          due: new Date(
            assignment.dueDate
          ).toLocaleDateString(),
          label,
          priority,
        };
      }
    );

    res.status(200).json(data);

  } catch (error) {
    console.error(
      "UPCOMING DEADLINES ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// =======================================
// EXPORTS
// =======================================

module.exports = {
  createAssignment,
  createInstructorAssignment,

  getAssignments,
  getInstructorAssignments,

  getAssignmentById,

  updateAssignment,
  updateInstructorAssignment,

  deleteAssignment,
  deleteInstructorAssignment,

  getStudentAssignments,
  getUpcomingDeadlines,
};