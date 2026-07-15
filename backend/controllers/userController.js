const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Student = require("../models/Student");


// ==========================================
// GET ALL USERS
// GET /api/users
// ==========================================
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password");

    res.status(200).json(users);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ==========================================
// CREATE USER
// POST /api/users
// ==========================================
const createUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,

      // Student fields
      studentId,
      department,
      faculty,
      level,
      semester,
      phone,

    } = req.body;


    // Validate common fields
    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }


    // Validate student fields
    if (role === "student") {

      if (
        !studentId ||
        !department ||
        !level
      ) {
        return res.status(400).json({
          message:
            "Student ID, department and level are required.",
        });
      }
    }


    // Check existing email
    const existingUser =
      await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json({
        message:
          "Email already exists.",
      });
    }



    // Check student ID
    if (role === "student") {

      const existingStudent =
        await Student.findOne({
          studentId,
        });


      if (existingStudent) {
        return res.status(400).json({
          message:
            "Student ID already exists.",
        });
      }
    }



    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);



    // Create User
    const user =
      await User.create({

        name,

        email,

        password: hashedPassword,

        role,

        status: "active",

      });



    let student = null;



    // ==================================
    // Automatically create student profile
    // ==================================

    if (role === "student") {

      student =
        await Student.create({

          user: user._id,

          studentId,

          department,

          faculty,

          level,

          semester,

          phone,

          status: "active",

        });

    }



    res.status(201).json({

      message:
        "User created successfully.",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      student,

    });


  } catch (error) {

    console.error(error);


    res.status(500).json({

      message:
        "Server Error",

    });

  }
};




// ==========================================
// UPDATE USER
// PUT /api/users/:id
// ==========================================
const updateUser = async (req, res) => {

  try {

    const { id } = req.params;


    const user =
      await User.findByIdAndUpdate(

        id,

        req.body,

        {
          new: true,
        }

      )
      .select("-password");



    if (!user) {

      return res.status(404).json({

        message:
          "User not found.",

      });

    }



    res.status(200).json({

      message:
        "User updated successfully.",

      user,

    });



  } catch(error){

    console.error(error);


    res.status(500).json({

      message:
        "Server Error",

    });

  }

};




// ==========================================
// DELETE USER
// DELETE /api/users/:id
// ==========================================
const deleteUser = async (req,res)=>{

  try {

    const {id}=req.params;


    const user =
      await User.findById(id);



    if(!user){

      return res.status(404).json({

        message:
          "User not found.",

      });

    }



    // Remove student profile too
    if(user.role === "student"){

      await Student.findOneAndDelete({

        user:user._id,

      });

    }



    await user.deleteOne();



    res.status(200).json({

      message:
        "User deleted successfully.",

    });



  } catch(error){

    console.error(error);


    res.status(500).json({

      message:
        "Server Error",

    });

  }

};



module.exports = {

  getUsers,

  createUser,

  updateUser,

  deleteUser,

};