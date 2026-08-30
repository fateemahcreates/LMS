const ClassSession = require("../models/ClassSession");
const Course = require("../models/Course");


// ======================================================
// CREATE CLASS SESSION
// POST /api/class-sessions
// Admin + Instructor
// ======================================================

const createClassSession = async (req, res) => {
  try {
    const {
      course,
      date,
      startTime,
      endTime,
      notes,
    } = req.body;


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !course ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message:
          "Course, date, start time, and end time are required.",
      });
    }


    // ==================================================
    // FIND COURSE
    // ==================================================

    const courseRecord =
      await Course.findById(course);

    if (!courseRecord) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }


    // ==================================================
    // DETERMINE INSTRUCTOR
    // ==================================================

    let instructorId;


    // Instructor creates session
    if (
      req.user.role === "instructor"
    ) {

      instructorId =
        req.user._id;


      // ================================================
      // SECURITY CHECK
      // Instructor can only create sessions
      // for their own course.
      // ================================================

      if (
        courseRecord.instructorUser?.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to create a session for this course.",
        });
      }

    } else {

      // ================================================
      // Admin creates session
      // Use the instructor assigned to the course.
      // ================================================

      instructorId =
        courseRecord.instructorUser;

      if (!instructorId) {
        return res.status(400).json({
          message:
            "This course does not have an instructor assigned.",
        });
      }

    }


    // ==================================================
    // CHECK DUPLICATE SESSION
    // ==================================================

    const existingSession =
      await ClassSession.findOne({
        course,
        date: new Date(date),
        startTime,
      });


    if (existingSession) {
      return res.status(409).json({
        message:
          "A class session already exists for this course, date, and start time.",
      });
    }


    // ==================================================
    // CREATE SESSION
    // ==================================================

    const session =
      await ClassSession.create({

        course,

        instructor:
          instructorId,

        date:
          new Date(date),

        startTime,

        endTime,

        status:
          "Scheduled",

        createdBy:
          req.user._id,

        notes:
          notes || "",

      });


    // ==================================================
    // POPULATE RESPONSE
    // ==================================================

    const populatedSession =
      await ClassSession.findById(
        session._id
      )
        .populate(
          "course",
          "title code"
        )
        .populate(
          "instructor",
          "name email"
        )
        .populate(
          "createdBy",
          "name email"
        );


    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(201).json({
      message:
        "Class session created successfully.",

      session:
        populatedSession,
    });

  } catch (error) {

    console.error(
      "Create class session error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to create class session.",
      error:
        error.message,
    });

  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createClassSession,
};