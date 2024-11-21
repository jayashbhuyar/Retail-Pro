// backend/routes/auth.js
const express = require("express");
const { registerUser, loginUser, logoutUser,updatePassword,resetPassword } = require("../controllers/authController");
const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/update-password",updatePassword);
router.post("/reset-password", resetPassword);

module.exports = router;
