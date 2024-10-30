const express = require('express');
const router = express.Router();
const {
 getAllOrders,
  getAllUsers
} = require('../controllers/adminController'); // Adjust with your controller path

// Fetch all users
router.get('/users', getAllUsers);

// Fetch all orders
router.get('/orders',getAllOrders);

module.exports = router;
