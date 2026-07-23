const Student = require("../models/Student");
const User = require("../models/User");

const bcrypt = require("bcryptjs");

const Enrollment = require("../models/Enrollment");
const Assignment = require("../models/Assignment");


// ==========================================
// CREATE STUDENT
// ==========================================

const createStudent = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      studentId,
      department,
      faculty,
      level,
      semester,
      phone,
    } = req.body;


    if (
      !name ||
      !email ||
      !password ||
      !studentId ||
      !department ||
      !level
    ) {

      return res.status(400).json({
        message:"Please fill all required fields.",
      });

    }



    const existingUser =
      await User.findOne({ email });


    if(existingUser){

      return res.status(400).json({
        message:"Email already exists.",
      });

    }



    const existingStudent =
      await Student.findOne({
        studentId,
      });



    if(existingStudent){

      return res.status(400).json({
        message:"Student ID already exists.",
      });

    }



    const hashedPassword =
      await bcrypt.hash(password,10);



    const user =
      await User.create({

        name,

        email,

        password:hashedPassword,

        role:"student",

        status:"active",

      });



    const student =
      await Student.create({

        user:user._id,

        studentId,

        department,

        faculty,

        level,

        semester,

        phone,

      });



    const populatedStudent =
      await Student.findById(student._id)
      .populate(
        "user",
        "name email role"
      );



    res.status(201).json({

      message:"Student created successfully.",

      student:populatedStudent,

    });



  } catch(error){

    console.error(error);


    res.status(500).json({
      message:"Server Error",
    });

  }

};




// ==========================================
// GET ALL STUDENTS
// ==========================================

const getStudents = async(req,res)=>{

  try{

    const students =
      await Student.find()
      .populate(
        "user",
        "name email role"
      )
      .sort({
        createdAt:-1,
      });



    res.status(200).json(students);



  }catch(error){

    console.error(error);


    res.status(500).json({
      message:"Server Error",
    });

  }

};




// ==========================================
// GET LOGGED-IN STUDENT PROFILE
// ==========================================

const getStudentProfile = async(req,res)=>{


  try{


    const student =
      await Student.findOne({

        user:req.user._id,

      })
      .populate(
        "user",
        "name email role"
      );



    if(!student){

      return res.status(404).json({

        message:"Student profile not found.",

      });

    }



    res.status(200).json(student);



  }catch(error){


    console.error(error);


    res.status(500).json({

      message:"Server Error",

    });


  }

};




// ==========================================
// UPDATE STUDENT PROFILE
// ==========================================

const updateStudentProfile = async(req,res)=>{


try{


const {
name,
phone,
department,
faculty,
level,
semester,
}=req.body;



const student =
await Student.findOne({

user:req.user._id,

});



if(!student){

return res.status(404).json({

message:"Student profile not found.",

});

}




await User.findByIdAndUpdate(
student.user,
{
name,
}
);




student.phone = phone;

student.department = department;

student.faculty = faculty;

student.level = level;

student.semester = semester;



await student.save();



const updatedStudent =
await Student.findById(student._id)
.populate(
"user",
"name email role"
);



res.status(200).json({

message:"Profile updated successfully.",

student:updatedStudent,

});



}catch(error){

console.error(error);


res.status(500).json({

message:"Server Error",

});


}


};




// ==========================================
// GET STUDENT DASHBOARD STATS
// ==========================================

const getStudentStats = async(req,res)=>{


try{


console.log("==============================");

console.log(
"Logged User:",
req.user._id
);



// Get enrolled courses

const enrollments =
await Enrollment.find({

student:req.user._id,

})
.populate("course");



console.log(
"Enrollments:",
enrollments.length
);



// Get course IDs

const courseIds =
enrollments.map(
(item)=>item.course._id
);



// Get assignments

const assignments =
await Assignment.find({

course:{
$in:courseIds,
},

status:"Active",

});



console.log(
"Assignments:",
assignments.length
);




// Calculate performance

let performance = "0%";


if(enrollments.length > 0){


const totalProgress =
enrollments.reduce(

(total,item)=>
total + item.progress,

0

);



performance =
`${Math.round(
totalProgress /
enrollments.length
)}%`;


}




const stats = {


enrolledCourses:
enrollments.length,


pendingAssignments:
assignments.length,


performance,


certificates:
enrollments.filter(
(item)=>
item.certificateApproved
).length,


};



console.log(
"Stats:",
stats
);


console.log("==============================");



res.status(200).json(stats);



}catch(error){


console.error(error);



res.status(500).json({

message:"Server Error",

});


}


};




// ==========================================
// UPDATE STUDENT (ADMIN)
// ==========================================

const updateStudent = async(req,res)=>{


try{


const {id}=req.params;


const {

name,

email,

studentId,

department,

faculty,

level,

semester,

phone,

}=req.body;



const student =
await Student.findById(id);



if(!student){

return res.status(404).json({

message:"Student not found.",

});

}



await User.findByIdAndUpdate(

student.user,

{
name,
email,
}

);



student.studentId = studentId;

student.department = department;

student.faculty = faculty;

student.level = level;

student.semester = semester;

student.phone = phone;



await student.save();



const updatedStudent =
await Student.findById(student._id)
.populate(
"user",
"name email role"
);



res.status(200).json({

message:"Student updated successfully.",

student:updatedStudent,

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Server Error",

});


}


};




// ==========================================
// DELETE STUDENT
// ==========================================

const deleteStudent = async(req,res)=>{


try{


const {id}=req.params;



const student =
await Student.findById(id);



if(!student){

return res.status(404).json({

message:"Student not found.",

});

}




await User.findByIdAndDelete(
student.user
);



await Student.findByIdAndDelete(id);



res.status(200).json({

message:"Student deleted successfully.",

});



}catch(error){


console.error(error);


res.status(500).json({

message:"Server Error",

});


}


};





module.exports = {

createStudent,

getStudents,

updateStudent,

deleteStudent,

getStudentProfile,

updateStudentProfile,

getStudentStats,

};