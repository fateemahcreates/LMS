const express = require("express");

const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// GET USERS
router.get(
  "/",
  protect,
  adminOnly,
  getUsers
);


// CREATE USER
router.post(
  "/",
  protect,
  adminOnly,
  createUser
);


// UPDATE USER
router.put(
  "/:id",
  protect,
  adminOnly,
  updateUser
);


// DELETE USER
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteUser
);


module.exports = router;