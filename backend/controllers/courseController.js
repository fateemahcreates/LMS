const Course = require("../models/Course");

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
      instructor,
      duration,
      level,
      thumbnail,
      price,
      status,
    } = req.body;

    // Validate required fields
    if (!title || !code) {
      return res.status(400).json({
        message: "Course title and code are required.",
      });
    }

    // Check duplicate course code
    const existingCourse = await Course.findOne({ code });

    if (existingCourse) {
      return res.status(400).json({
        message: "Course code already exists.",
      });
    }

    const course = await Course.create({
      title,
      code,
      description,
      category,
      instructor,
      duration,
      level,
      thumbnail,
      price,
      status,
    });

    res.status(201).json({
      message: "Course created successfully.",
      course,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET ALL COURSES
// ==========================================
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(courses);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
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

    res.json(courses);
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
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    Object.assign(course, req.body);

    await course.save();

    const updatedCourse = await Course.findById(id)
      .populate("instructor", "name email");

    res.status(200).json({
      message: "Course updated successfully.",
      course: updatedCourse,
    });

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
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      message: "Course deleted successfully.",
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
  getPublishedCourses,
  updateCourse,
  deleteCourse,
};