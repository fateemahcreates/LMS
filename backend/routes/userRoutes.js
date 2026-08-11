const express = require("express");

const router = express.Router();


const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  changeUserStatus,
  getInstructors,
} = require("../controllers/userController");


const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// ==========================================
// GET ALL USERS
// ==========================================

router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);



// ==========================================
// GET ALL INSTRUCTORS
// ==========================================

router.get(
  "/instructors",
  protect,
  adminOnly,
  getInstructors
);



// ==========================================
// GET SINGLE USER
// ==========================================

router.get(
  "/:id",
  protect,
  adminOnly,
  getUser
);



// ==========================================
// CREATE USER
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  createUser
);



// ==========================================
// UPDATE USER
// ==========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);



// ==========================================
// CHANGE USER ROLE
// ==========================================

router.patch(
  "/:id/role",
  protect,
  adminOnly,
  changeUserRole
);



// ==========================================
// CHANGE USER STATUS
// ==========================================

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  changeUserStatus
);



// ==========================================
// DELETE USER
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);



module.exports = router;