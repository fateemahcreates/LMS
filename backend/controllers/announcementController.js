const Announcement = require("../models/Announcement");
const Student = require("../models/Student");
const Course = require("../models/Course");

const {
  createNotification,
} = require("../services/notificationService");

const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      audience,
      course,
      isPinned,
      status,
      expiresAt,
    } = req.body;

    // ============================================================
    // BASIC VALIDATION
    // ============================================================

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required.",
      });
    }

    // ============================================================
    // NORMALIZE AUDIENCE
    // ============================================================

    const selectedAudience = audience || "Everyone";

    // ============================================================
    // COURSE VALIDATION
    // ============================================================

    let selectedCourse = null;

    if (selectedAudience === "Course") {
      if (!course) {
        return res.status(400).json({
          message:
            "Please select a course for a course-specific announcement.",
        });
      }

      selectedCourse = await Course.findById(course);

      if (!selectedCourse) {
        return res.status(404).json({
          message: "Selected course not found.",
        });
      }
    }

    // ============================================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ============================================================

    if (req.user.role === "instructor") {
      if (!selectedCourse) {
        return res.status(403).json({
          message:
            "Instructors can only create announcements for their assigned courses.",
        });
      }

      if (
        selectedCourse.instructorUser.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          message:
            "You are not authorized to create an announcement for this course.",
        });
      }
    }

    // ============================================================
    // CREATE ANNOUNCEMENT
    // ============================================================

    const announcement = await Announcement.create({
      title: title.trim(),

      description: description.trim(),

      type: type || "General",

      audience: selectedAudience,

      course:
        selectedAudience === "Course"
          ? selectedCourse._id
          : null,

      isPinned: isPinned === true,

      status: status || "Active",

      expiresAt: expiresAt || null,

      createdBy: req.user._id,
    });

    // ============================================================
    // FIND STUDENTS TO NOTIFY
    // ============================================================

    let studentsToNotify = [];

    // ============================================================
    // EVERYONE
    // ============================================================

    if (selectedAudience === "Everyone") {
      studentsToNotify = await Student.find({
        user: {
          $ne: null,
        },
      }).populate(
        "user",
        "name email notificationPreferences"
      );
    }

    // ============================================================
    // SPECIFIC COURSE
    // ============================================================

    if (selectedAudience === "Course") {
      // ----------------------------------------------------------
      // IMPORTANT
      //
      // Course.students contains Student._id values.
      // ----------------------------------------------------------

      const enrolledStudentIds =
        selectedCourse.students || [];

      console.log(
        "================================================"
      );

      console.log(
        "COURSE ANNOUNCEMENT DEBUG"
      );

      console.log(
        "Course:",
        selectedCourse.title
      );

      console.log(
        "Course ID:",
        selectedCourse._id
      );

      console.log(
        "Student IDs in course:",
        enrolledStudentIds
      );

      console.log(
        "Number of enrolled students:",
        enrolledStudentIds.length
      );

      console.log(
        "================================================"
      );

      // ----------------------------------------------------------
      // Find the actual Student documents
      // ----------------------------------------------------------

      studentsToNotify = await Student.find({
        _id: {
          $in: enrolledStudentIds,
        },

        user: {
          $ne: null,
        },
      }).populate(
        "user",
        "name email notificationPreferences"
      );

      console.log(
        "Students found for notification:",
        studentsToNotify.length
      );
    }

    // ============================================================
    // CREATE NOTIFICATIONS
    // ============================================================

    for (const student of studentsToNotify) {
      if (!student.user) {
        continue;
      }

      try {
        await createNotification({
          recipient: student.user._id,

          type: "announcement",

          title:
            `New Announcement: ${title.trim()}`,

          message:
            description.trim(),

          link:
            "/announcements",

          relatedId:
            announcement._id,

          relatedModel:
            "Announcement",

          priority:
            isPinned === true
              ? "high"
              : "normal",

          sendEmailNotification: true,
        });

        console.log(
          `Notification created for student: ${student.user.email}`
        );

      } catch (notificationError) {
        console.error(
          `Failed to notify student ${student.user._id}:`,
          notificationError.message
        );
      }
    }

    // ============================================================
    // RETURN POPULATED ANNOUNCEMENT
    // ============================================================

    const populatedAnnouncement =
      await Announcement.findById(
        announcement._id
      )
        .populate(
          "course",
          "title code"
        )
        .populate(
          "createdBy",
          "name"
        );

    // ============================================================
    // RESPONSE
    // ============================================================

    res.status(201).json({
      message:
        "Announcement created successfully.",

      announcement:
        populatedAnnouncement,

      notificationRecipients:
        studentsToNotify.length,
    });

  } catch (error) {
    console.error(
      "Create announcement error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to create announcement.",

      error:
        error.message,
    });
  }
};
// ============================================================
// GET ANNOUNCEMENTS
// GET /api/announcements
// ============================================================
//
// ADMIN
// → Gets all active announcements
//
// INSTRUCTOR
// → Gets announcements created by that instructor
//
// STUDENT
// → Gets:
//    1. Everyone announcements
//    2. Course announcements only for enrolled courses
//
// Archived announcements are hidden.
// Expired announcements are hidden.
// ============================================================

const getAnnouncements = async (req, res) => {
  try {

    // ========================================================
    // ACTIVE + NON-EXPIRED FILTER
    // ========================================================

    const baseFilter = {

      status: "Active",

      $or: [
        {
          expiresAt: null,
        },

        {
          expiresAt: {
            $gt: new Date(),
          },
        },
      ],
    };


    // ========================================================
    // ADMIN
    // ========================================================

    if (req.user.role === "admin") {

      const announcements =
        await Announcement.find(
          baseFilter
        )
          .populate(
            "course",
            "title code"
          )
          .populate(
            "createdBy",
            "name"
          )
          .sort({
            isPinned: -1,
            createdAt: -1,
          });


      return res.json(
        announcements
      );
    }


    // ========================================================
    // INSTRUCTOR
    // ========================================================

    if (req.user.role === "instructor") {

      const announcements =
        await Announcement.find({

          ...baseFilter,

          createdBy:
            req.user._id,

        })
          .populate(
            "course",
            "title code"
          )
          .populate(
            "createdBy",
            "name"
          )
          .sort({
            isPinned: -1,
            createdAt: -1,
          });


      return res.json(
        announcements
      );
    }


    // ========================================================
    // STUDENT
    // ========================================================

    if (req.user.role === "student") {

      // ------------------------------------------------------
      // Find Student Profile
      // ------------------------------------------------------

      const student =
        await Student.findOne({
          user: req.user._id,
        });


      if (!student) {

        return res.status(404).json({
          message:
            "Student profile not found.",
        });
      }


      // ------------------------------------------------------
      // Find Student's Enrolled Courses
      // ------------------------------------------------------

      const enrolledCourses =
        await Course.find({
          students: student._id,
        }).select("_id");


      const enrolledCourseIds =
        enrolledCourses.map(
          (course) => course._id
        );


      // ------------------------------------------------------
      // Student Announcement Filter
      // ------------------------------------------------------

      const studentFilter = {

        ...baseFilter,

        $or: [

          // ----------------------------------------------
          // Everyone announcements
          // ----------------------------------------------

          {
            audience: "Everyone",
          },


          // ----------------------------------------------
          // Course announcements
          // Only enrolled courses
          // ----------------------------------------------

          {
            audience: "Course",

            course: {
              $in:
                enrolledCourseIds,
            },
          },

        ],
      };


      const announcements =
        await Announcement.find(
          studentFilter
        )
          .populate(
            "course",
            "title code"
          )
          .populate(
            "createdBy",
            "name"
          )
          .sort({
            isPinned: -1,
            createdAt: -1,
          });


      return res.json(
        announcements
      );
    }


    // ========================================================
    // UNKNOWN ROLE
    // ========================================================

    return res.status(403).json({
      message:
        "You are not authorized to view announcements.",
    });


  } catch (error) {

    console.error(
      "Get announcements error:",
      error
    );


    res.status(500).json({
      message:
        "Failed to fetch announcements.",

      error:
        error.message,
    });
  }
};



// ============================================================
// GET SINGLE ANNOUNCEMENT
// GET /api/announcements/:id
// ============================================================

const getAnnouncement = async (req, res) => {
  try {

    const announcement =
      await Announcement.findById(
        req.params.id
      )
        .populate(
          "course",
          "title code instructorUser"
        )
        .populate(
          "createdBy",
          "name"
        );


    if (!announcement) {

      return res.status(404).json({
        message:
          "Announcement not found.",
      });
    }


    // ========================================================
    // ADMIN CAN VIEW
    // ========================================================

    if (req.user.role === "admin") {

      return res.json(
        announcement
      );
    }


    // ========================================================
    // INSTRUCTOR CAN VIEW OWN ANNOUNCEMENTS
    // ========================================================

    if (req.user.role === "instructor") {

      if (
        announcement.createdBy._id.toString() !==
        req.user._id.toString()
      ) {

        return res.status(403).json({
          message:
            "You are not authorized to view this announcement.",
        });
      }


      return res.json(
        announcement
      );
    }


    // ========================================================
    // STUDENT ACCESS
    // ========================================================

    if (req.user.role === "student") {

      // ----------------------------------------------
      // Announcement must be active
      // ----------------------------------------------

      if (
        announcement.status !==
        "Active"
      ) {

        return res.status(404).json({
          message:
            "Announcement not available.",
        });
      }


      // ----------------------------------------------
      // Check expiry
      // ----------------------------------------------

      if (
        announcement.expiresAt &&
        new Date(
          announcement.expiresAt
        ) <= new Date()
      ) {

        return res.status(404).json({
          message:
            "Announcement has expired.",
        });
      }


      // ----------------------------------------------
      // Everyone announcement
      // ----------------------------------------------

      if (
        announcement.audience ===
        "Everyone"
      ) {

        return res.json(
          announcement
        );
      }


      // ----------------------------------------------
      // Course announcement
      // ----------------------------------------------

      if (
        announcement.audience ===
        "Course"
      ) {

        const student =
          await Student.findOne({
            user: req.user._id,
          });


        if (!student) {

          return res.status(404).json({
            message:
              "Student profile not found.",
          });
        }


        const enrolledCourse =
          await Course.findOne({

            _id:
              announcement.course._id,

            students:
              student._id,

          });


        if (!enrolledCourse) {

          return res.status(403).json({
            message:
              "You are not enrolled in this course.",
          });
        }


        return res.json(
          announcement
        );
      }
    }


    return res.status(403).json({
      message:
        "You are not authorized to view this announcement.",
    });


  } catch (error) {

    console.error(
      "Get announcement error:",
      error
    );


    res.status(500).json({
      message:
        "Failed to fetch announcement.",

      error:
        error.message,
    });
  }
};



// ============================================================
// UPDATE ANNOUNCEMENT
// PUT /api/announcements/:id
// ============================================================

const updateAnnouncement = async (req, res) => {
  try {

    const announcement =
      await Announcement.findById(
        req.params.id
      );


    if (!announcement) {

      return res.status(404).json({
        message:
          "Announcement not found.",
      });
    }


    // ========================================================
    // OWNERSHIP CHECK
    // ========================================================

    if (
      req.user.role === "instructor" &&
      announcement.createdBy.toString() !==
        req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "You are not authorized to update this announcement.",
      });
    }


    // ========================================================
    // COURSE VALIDATION
    // ========================================================

    let selectedCourse = null;


    if (
      req.body.audience ===
      "Course"
    ) {

      if (!req.body.course) {

        return res.status(400).json({
          message:
            "Please select a course.",
        });
      }


      selectedCourse =
        await Course.findById(
          req.body.course
        );


      if (!selectedCourse) {

        return res.status(404).json({
          message:
            "Selected course not found.",
        });
      }


      // ------------------------------------------------------
      // Instructor ownership
      // ------------------------------------------------------

      if (
        req.user.role === "instructor" &&
        selectedCourse.instructorUser.toString() !==
          req.user._id.toString()
      ) {

        return res.status(403).json({
          message:
            "You are not authorized to use this course.",
        });
      }
    }


    // ========================================================
    // UPDATE FIELDS
    // ========================================================

    announcement.title =
      req.body.title;

    announcement.description =
      req.body.description;

    announcement.type =
      req.body.type ||
      "General";

    announcement.audience =
      req.body.audience ||
      "Everyone";

    announcement.course =
      req.body.audience ===
      "Course"
        ? selectedCourse._id
        : null;

    announcement.isPinned =
      req.body.isPinned === true;

    announcement.status =
      req.body.status ||
      "Active";

    announcement.expiresAt =
      req.body.expiresAt ||
      null;


    await announcement.save();


    // ========================================================
    // RETURN UPDATED ANNOUNCEMENT
    // ========================================================

    const updatedAnnouncement =
      await Announcement.findById(
        announcement._id
      )
        .populate(
          "course",
          "title code"
        )
        .populate(
          "createdBy",
          "name"
        );


    res.json({

      message:
        "Announcement updated successfully.",

      announcement:
        updatedAnnouncement,

    });


  } catch (error) {

    console.error(
      "Update announcement error:",
      error
    );


    res.status(500).json({
      message:
        "Failed to update announcement.",

      error:
        error.message,
    });
  }
};



// ============================================================
// DELETE ANNOUNCEMENT
// DELETE /api/announcements/:id
// ============================================================

const deleteAnnouncement = async (req, res) => {
  try {

    const announcement =
      await Announcement.findById(
        req.params.id
      );


    if (!announcement) {

      return res.status(404).json({
        message:
          "Announcement not found.",
      });
    }


    // ========================================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ========================================================

    if (
      req.user.role === "instructor" &&
      announcement.createdBy.toString() !==
        req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "You are not authorized to delete this announcement.",
      });
    }


    await announcement.deleteOne();


    res.json({
      message:
        "Announcement deleted successfully.",
    });


  } catch (error) {

    console.error(
      "Delete announcement error:",
      error
    );


    res.status(500).json({
      message:
        "Failed to delete announcement.",

      error:
        error.message,
    });
  }
};



// ============================================================
// PIN / UNPIN ANNOUNCEMENT
// PATCH /api/announcements/:id/pin
// ============================================================

const togglePinAnnouncement = async (
  req,
  res
) => {
  try {

    const announcement =
      await Announcement.findById(
        req.params.id
      );


    if (!announcement) {

      return res.status(404).json({
        message:
          "Announcement not found.",
      });
    }


    // ========================================================
    // INSTRUCTOR OWNERSHIP CHECK
    // ========================================================

    if (
      req.user.role === "instructor" &&
      announcement.createdBy.toString() !==
        req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
          "You are not authorized to pin this announcement.",
      });
    }


    announcement.isPinned =
      !announcement.isPinned;


    await announcement.save();


    const updatedAnnouncement =
      await Announcement.findById(
        announcement._id
      )
        .populate(
          "course",
          "title code"
        )
        .populate(
          "createdBy",
          "name"
        );


    res.json({

      message:
        updatedAnnouncement.isPinned
          ? "Announcement pinned."
          : "Announcement unpinned.",

      announcement:
        updatedAnnouncement,

    });


  } catch (error) {

    console.error(
      "Toggle pin announcement error:",
      error
    );


    res.status(500).json({
      message:
        "Failed to update announcement.",

      error:
        error.message,
    });
  }
};



// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  createAnnouncement,

  getAnnouncements,

  getAnnouncement,

  updateAnnouncement,

  deleteAnnouncement,

  togglePinAnnouncement,

};