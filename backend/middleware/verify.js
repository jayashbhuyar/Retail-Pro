// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Get token from cookies
    
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }
    console.log("checking1")

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token (user data) to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

const validate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Get token from cookies
    
    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }
    console.log("checking1")

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token (user data) to the request object
    // next(); // Continue to the next middleware or route handler
    return res.status(201).json({msg:"success"});
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = {verifyToken, validate};
