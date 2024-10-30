// backend/routes/auth.js
const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;
