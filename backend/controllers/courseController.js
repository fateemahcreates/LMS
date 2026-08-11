const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");

// ==========================================
// CREATE COURSE
// ==========================================
// ==========================================
// CREATE COURSE
// ==========================================
const createCourse = async (req, res) => {
  try {
    const {
      title,
      code,
      description,
      category,
      duration,
      level,
      thumbnail,
      price,
      status,
      instructorUser,
    } = req.body;

    if (!title || !code) {
      return res.status(400).json({
        message: "Course title and code are required.",
      });
    }

    if (!instructorUser) {
      return res.status(400).json({
        message: "Please assign an instructor.",
      });
    }

    const existingCourse = await Course.findOne({ code });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course code already exists.",
      });
    }

    // Find selected instructor
    const instructor = await User.findById(instructorUser);

    if (!instructor) {
      return res.status(404).json({
        message: "Instructor not found.",
      });
    }

    console.log("========== REQUEST BODY ==========");
console.log(req.body);

console.log("========== SELECTED INSTRUCTOR ==========");
console.log(instructor);

console.log("========== LOGGED IN USER ==========");
console.log(req.user);
    const course = await Course.create({
      title,
      code,
      description,
      category,
      duration,
      level,
      thumbnail,
      price,
      status,

      // Save both the name and reference
      instructor: instructor.name,
      instructorUser: instructor._id,
    });

    res.status(201).json(course);
  } catch (error) {
  console.log("========== CREATE COURSE ERROR ==========");
  console.log(error);
  console.log(error.stack);

  res.status(500).json({
    message: error.message,
  });
}
};

// ==========================================
// GET COURSES
// ==========================================
const getCourses = async (req, res) => {
  try {

    let courses;


    if(req.user.role === "instructor") {

      courses = await Course.find({
        instructorUser: req.user.id
      })
      .populate(
        "instructorUser",
        "name email"
      );

    } else {

      courses = await Course.find()
      .populate(
        "instructorUser",
        "name email"
      );

    }


    res.status(200).json(courses);


  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};

// ==========================================
// GET INSTRUCTOR COURSES
// ==========================================
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructorUser: req.user._id,
    })
      .populate(
        "instructorUser",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json(courses);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE COURSE
// ==========================================
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructorUser", "name email");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET PUBLISHED COURSES
// ==========================================
const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      status: "Published",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE COURSE
// ==========================================
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    if (
      req.user.role.toLowerCase() === "instructor" &&
      course.instructorUser.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot edit another instructor's course.",
      });
    }

    Object.assign(course, req.body);

    await course.save();

    res.status(200).json(course);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// DELETE COURSE
// ==========================================
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // Instructors can only delete their own courses
    if (
      req.user.role.toLowerCase() === "instructor" &&
      course.instructorUser.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You cannot delete another instructor's course.",
      });
    }

    // ==========================================
    // DELETE ALL ENROLLMENTS FOR THIS COURSE
    // ==========================================
    await Enrollment.deleteMany({
      course: course._id,
    });

    // ==========================================
    // DELETE COURSE
    // ==========================================
    await course.deleteOne();

    res.status(200).json({
      message: "Course and related enrollments deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getInstructorCourses,
  getPublishedCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};