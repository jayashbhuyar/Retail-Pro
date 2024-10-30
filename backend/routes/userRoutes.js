const express = require("express");
const { getAllRetailers, getAllDistributors ,getUserByEmail,deleteRetailer,deleteDistributor} = require("../controllers/userController");
// const { addProduct } = require("../controllers/productController");
const router = express.Router();

// Get all retailers
router.get("/retailers", getAllRetailers);
router.get("/distributors", getAllDistributors);
// router.post("/add", addProduct);
router.get('/data/:email',getUserByEmail);

router.delete("/retailers/:id", deleteRetailer); // Route to delete a retailer by ID
router.delete("/distributors/:id", deleteDistributor);

module.exports = router;