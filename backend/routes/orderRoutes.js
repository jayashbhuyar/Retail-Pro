const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getPendingOrders,
  updateOrderStatus,
  rejectOrder,
  deleteOrder,
  getRejectedOrders,
  getAcceptedOrders,
  updateOrderStatusCompleted,
  getCompletedOrders,
  getPendingOrdersByEmail,
  getAcceptedOrdersByEmail,
  getRejectedOrdersByEmail,
  getCompletedOrdersByEmail,
  updateOrderMsgRetail,
  updateOrderStatusRetail,
  updateAcceptedMessage,
  deleteRejectedOrder,
  getOrderById
} = require("../controllers/orderController");

// Route to place a new order
router.post("/place", placeOrder);

// Get all pending orders for a distributor by email
router.get("/pending", getPendingOrders);

// Update the status of an order (Accept/Reject)
router.patch("/status/:orderId", updateOrderStatus);
router.patch("/status/:id", rejectOrder);

// Route to fetch rejected orders by distributor email
router.get("/rejected", getRejectedOrders);

// Route to delete an order by its ID
router.delete("/status/:id", deleteOrder);

router.get("/accepted", getAcceptedOrders);

router.put("/:orderId/status", updateOrderStatusCompleted);
router.get("/completed", getCompletedOrders); // New route for completed orders

// New route to get pending orders by user email
router.get("/pending-by-email", getPendingOrdersByEmail);

// Route to get accepted orders by user email
router.get("/accepted-by-email", getAcceptedOrdersByEmail);

// Route to get rejected orders by user email
router.get("/rejected-by-email", getRejectedOrdersByEmail);

// Route to get completed orders by user email
router.get("/completed-by-email", getCompletedOrdersByEmail);

router.patch("/retail/msg/:orderId", updateOrderMsgRetail); // This should handle both status updates and message updates
router.patch("/retail/status/:orderId", updateOrderStatusRetail); // This should handle both status updates and message updates

router.put('/update-message/:id',updateAcceptedMessage)//update the message of the accepted page
//delete the rejected orders
router.delete('/delete-rejected/:orderId', deleteRejectedOrder);
// ******************************************************************************************
// Get specific order by ID
router.get('/getdata/:id', getOrderById);


module.exports = router;
