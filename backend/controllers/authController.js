const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // JWT for token generation
require("dotenv").config(); // Ensure environment variables are used

// User registration
exports.registerUser = async (req, res) => {
  const { name, email, phone, password, role, companyName, shopName, image, address } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword, // Save hashed password
      role,
      companyName: role === "distributor" ? companyName : undefined,
      shopName: role === "retailer" ? shopName : undefined,
      image,
      address,
    });

    // Save new user
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find the user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    ); // Use environment variable for secret

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,           // Prevent access to cookie via JavaScript
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict",       // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
    // console.log(res.cookie)
    // const data = await res.json();
    // console.log(data.token)

    // Send response with user data (but not the token directly in the response body)
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        shopName: user.shopName,
        image: user.image,
        address: user.address,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Logout functionality (optional but recommended)
// Logout functionality
exports.logoutUser = (req, res) => {
  // Clear the token cookie to log out the user
  res.clearCookie("token", {
    httpOnly: true, // Same options as when you set the cookie
    secure: process.env.NODE_ENV === "production", // Only in production over HTTPS
    sameSite: "Strict", // Prevent CSRF attacks
  });
  
  // Optionally, send a success response
  res.status(200).json({ message: "Logged out successfully" });
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Check that currentPassword and newPassword are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new passwords are required" });
    }

    // Get the user from the token (assumes token middleware adds user ID to req.user)
    const user = await User.findById(req.user.id);
    if (!user || !user.password) {
      return res.status(404).json({ message: "User not found or password is undefined" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};