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
      duration,
      level,
      thumbnail,
      price,
      status,
    } = req.body;


    if (!title || !code) {
      return res.status(400).json({
        message: "Course title and code are required.",
      });
    }


    const existingCourse = await Course.findOne({
      code,
    });


    if (existingCourse) {
      return res.status(400).json({
        message: "Course code already exists.",
      });
    }


    const courseData = {

      title,
      code,
      description,
      category,
      duration,
      level,
      thumbnail,
      price,
      status,

     
     // Instructor information
instructor: req.user.name,
instructorUser: req.user._id,
    };


    const course = await Course.create(courseData);


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
// GET COURSES
// ==========================================
const getCourses = async (req, res) => {

  try {

    let courses;


    if (req.user.role === "Admin") {


    courses = await Course.find()

      .populate("students")

      .sort({
        createdAt:-1
      });


} 


else if (req.user.role === "Instructor") {


    courses = await Course.find({

        instructorUser:req.user._id

    })

    .populate("students")

    .sort({
        createdAt:-1
    });


}
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
const getPublishedCourses = async (
  req,
  res
) => {

  try {


    const courses =
      await Course.find({
        status: "Published",
      })
      
      .sort({
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
const updateCourse = async (
  req,
  res
) => {

  try {


    const course =
      await Course.findById(
        req.params.id
      );


    if (!course) {

      return res.status(404).json({
        message: "Course not found.",
      });

    }



    // Instructor ownership check
if (

req.user.role === "Instructor"

&&

course.instructorUser.toString() !== req.user._id.toString()

){

      return res.status(403).json({
        message:
        "You cannot modify another instructor's course.",
      });

    }



    Object.assign(
      course,
      req.body
    );
    
    if (req.user.role === "instructor") {
  course.instructor = req.user.name;
  course.instructorUser = req.user._id;
}


    // Prevent instructor changing ownership

    course.instructor =
      course.instructor;


    await course.save();



    res.status(200).json({

      message:
      "Course updated successfully.",

      course,

    });



  } catch(error) {


    console.error(error);


    res.status(500).json({
      message:"Server Error",
    });


  }

};




// ==========================================
// DELETE COURSE
// ==========================================
const deleteCourse = async (
  req,
  res
) => {

  try {


    const course =
      await Course.findById(
        req.params.id
      );



    if (!course) {

      return res.status(404).json({
        message:
        "Course not found.",
      });

    }



   if (

req.user.role === "Instructor"

&&

      course.instructorUser.toString() !== req.user._id.toString()
    ) {

      return res.status(403).json({
        message:
        "You cannot delete another instructor's course.",
      });

    }



    await course.deleteOne();



    res.status(200).json({

      message:
      "Course deleted successfully.",

    });



  } catch(error) {


    console.error(error);


    res.status(500).json({
      message:"Server Error",
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