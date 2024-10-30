// routes/landingpageRoutes.js
const express = require("express");
const router = express.Router();
const AllProducts = require("../controllers/landingController");

// Define your route
router.get("/products/all", AllProducts);

// Export the router instance
module.exports = router;
