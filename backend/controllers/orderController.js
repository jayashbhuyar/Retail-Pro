const Order = require("../models/Orders");
const User = require("../models/User");

// Controller to place an order
const placeOrder = async (req, res) => {
  try {
    const {
      distributorId,
      distributorName,
      distributorEmail,
      userId,
      userName,
      userEmail,
      userPhone,
      shopName,
      quantity,
      price,
      msg,
      deliveryBefore,
      retailerAddress,
      orderCancelReason,
      status,
      img,
      productName,
      productId,
    } = req.body;

    // // Validate required fields
    // if (!distributorId || !userId || !quantity || !price) {
    //   return res.status(400).json({ error: "Missing required fields" });
    // }

    // Create new order instance
    const newOrder = new Order({
      distributorId,
      distributorName,
      distributorEmail,
      userId,
      userName,
      userEmail,
      userPhone,
      shopName,
      quantity,
      price,
      msg,
      deliveryBefore,
      retailerAddress,
      orderCancelReason,
      img,
      productName,
      productId,
      status: status || "pending", // Default to pending if not provided
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ error: "Failed to place the order" });
  }
};
// const Order = require("../models/order");

// Controller to fetch all pending orders for a specific distributor by email
const getPendingOrders = async (req, res) => {
  const { distributorEmail } = req.query;

  // Check if distributorEmail is provided
  if (!distributorEmail) {
    return res.status(400).json({ error: "Distributor email is required" });
  }

  try {
    // Find all orders with status 'pending' for the given distributor email
    const pendingOrders = await Order.find({
      status: "pending",
      distributorEmail: distributorEmail,
    });

    // Instead of returning 404, return an empty array
    res.status(200).json(pendingOrders);
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to update the order status (accept/reject)
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, deliveryBefore } = req.body; // Include deliveryBefore from the request body

  // Ensure the status is one of the allowed values
  const validStatuses = ["pending", "accepted", "rejected", "completed"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    // Prepare the update object
    const updateData = { status };

    // If the status is "accepted", include the deliveryBefore date
    if (status === "accepted" && deliveryBefore) {
      updateData.deliveryBefore = deliveryBefore;
    }

    // Find the order by ID and update its status (and possibly deliveryBefore)
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: `Order status updated to ${status}`, updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ********************************************************************************
// const rejectOrder = async (req, res) => {
//   try {
//     const { orderCancelReason, status } = req.body;
//     const orderId = req.params.id; // Ensure this is correct

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       {
//         status, // Update status
//         orderCancelReason, // Update orderCancelReason
//       },
//       { new: true } // Return the updated order
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json(updatedOrder); // Return the updated order
//   } catch (error) {
//     console.error("Error updating order:", error);
//     res.status(500).json({ message: "Error rejecting order", error });
//   }
// };

// Fetch rejected orders by distributor email
const getRejectedOrders = async (req, res) => {
  const distributorEmail = req.query.distributorEmail;

  if (!distributorEmail) {
    return res.status(400).json({ message: "Distributor email is required." });
  }

  try {
    const rejectedOrders = await Order.find({
      distributorEmail,
      status: "rejected",
    });

    // Instead of returning 404, return an empty array with a 200 status
    res.status(200).json(rejectedOrders);
  } catch (error) {
    console.error("Error fetching rejected orders:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Delete an order by ID
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// orderController.js

const getAcceptedOrders = async (req, res) => {
  const distributorEmail = req.query.distributorEmail;

  if (!distributorEmail) {
    return res.status(400).json({ message: "Distributor email is required." });
  }

  // console.log("Fetching accepted orders for:", distributorEmail); // Debug log

  try {
    const acceptedOrders = await Order.find({
      distributorEmail,
      status: "accepted",
    });

    // console.log("Accepted Orders Found:", acceptedOrders); // Debug log

    res.status(200).json(acceptedOrders);
  } catch (error) {
    console.error("Error fetching accepted orders:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// orderController.js

const updateOrderStatusCompleted = async (req, res) => {
  const { orderId } = req.params;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status: "completed",
        completedOn: new Date(), // Sets the completedOn field to the current date
      },
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// orderController.js

const getCompletedOrders = async (req, res) => {
  const { distributorEmail } = req.query;

  try {
    const completedOrders = await Order.find({
      status: "completed",
      distributorEmail: distributorEmail, // Filter by distributor email
    });

    res.json(completedOrders);
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// New controller function to get pending orders by user email
const getPendingOrdersByEmail = async (req, res) => {
  const { userEmail } = req.query; // Get userEmail from query parameters

  try {
    // Fetch pending orders for the given user email
    const pendingOrders = await Order.find({
      userEmail: userEmail,
      status: "pending",
    });

    if (!pendingOrders.length) {
      return res.status(404).json({ message: "No pending orders found." });
    }

    return res.status(200).json(pendingOrders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching pending orders." });
  }
};

// const Order = require("../models/Order"); // Adjust the path as necessary

// Get pending orders by user email
// constgetPendingOrdersByEmail = async (req, res) => {
//   const { userEmail } = req.query;

//   try {
//     const pendingOrders = await Order.find({ userEmail: userEmail, status: "pending" });
//     if (!pendingOrders.length) {
//       return res.status(404).json({ message: "No pending orders found." });
//     }
//     return res.status(200).json(pendingOrders);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "An error occurred while fetching pending orders." });
//   }
// };

// Get accepted orders by user email
const getAcceptedOrdersByEmail = async (req, res) => {
  const { userEmail } = req.query;

  try {
    const acceptedOrders = await Order.find({
      userEmail: userEmail,
      status: "accepted",
    });
    if (!acceptedOrders.length) {
      return res.status(404).json({ message: "No accepted orders found." });
    }
    return res.status(200).json(acceptedOrders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching accepted orders." });
  }
};

// Get rejected orders by user email
const getRejectedOrdersByEmail = async (req, res) => {
  const { userEmail } = req.query;

  try {
    const rejectedOrders = await Order.find({
      userEmail: userEmail,
      status: "rejected",
    });
    if (!rejectedOrders.length) {
      return res.status(404).json({ message: "No rejected orders found." });
    }
    return res.status(200).json(rejectedOrders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching rejected orders." });
  }
};

// Get completed orders by user email
const getCompletedOrdersByEmail = async (req, res) => {
  const { userEmail } = req.query;

  try {
    const completedOrders = await Order.find({
      userEmail: userEmail,
      status: "completed",
    });
    if (!completedOrders.length) {
      return res.status(404).json({ message: "No completed orders found." });
    }
    return res.status(200).json(completedOrders);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching completed orders." });
  }
};

const updateOrderMsgRetail = async (req, res) => {
  const { orderId } = req.params; // Get orderId from the request parameters
  const { status, msg } = req.body; // Get status and msg from the request body

  try {
    // Find the order by ID and update the status and message
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, msg }, // Update the status and message
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.status(200).json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the order." });
  }
};
// ########################################################################################################
const rejectOrder = async (req, res) => {
  try {
    const { orderCancelReason, status } = req.body;
    const orderId = req.params.id;

    // Find the order to get the productId
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { productId } = order; // Extract productId from the order

    // Update the order status and cancellation reason
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        orderCancelReason,
      },
      { new: true } // Return the updated order
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Include productId in the response
    res.status(200).json({ ...updatedOrder.toObject(), productId });
  } catch (error) {
    console.error("Error rejecting order:", error);
    res.status(500).json({ message: "Error rejecting order", error });
  }
};
// ##########################################################################################################
// const updateOrderStatusRetail = async (req, res) => {
//   const { orderId } = req.params; // Get orderId from the request parameters
//   const { status, msg } = req.body; // Get status and msg from the request body

//   try {
//     // Validate the status
//     const validStatuses = ["pending", "accepted", "rejected", "completed", "cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid status provided." });
//     }

//     // Find the order by ID and update the status and message
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { status, msg }, // Update the status and message
//       { new: true } // Return the updated document
//     );

//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order not found." });
//     }

//     return res.status(200).json(updatedOrder); // Return the updated order
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "An error occurred while updating the order status." });
//   }
// };

const updateOrderStatusRetail = async (req, res) => {
  const { orderId } = req.params; // Get orderId from the request parameters
  const { status, msg } = req.body; // Get status and msg from the request body

  try {
    // Validate the status
    const validStatuses = [
      "pending",
      "accepted",
      "rejected",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    // Find the order by ID and update the status and message
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status, msg }, // Update the status and message
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Step 1: Return the updated order which contains the productId
    return res.status(200).json(updatedOrder); // Return the updated order
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the order status." });
  }
};

// In your Express backend (orders.js or wherever you handle order routes)
const updateAcceptedMessage = async (req, res) => {
  const { id } = req.params;
  const { newMessage } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { msg: newMessage },
      { new: true } // returns the updated document
    );
    if (!updatedOrder) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.status(200).send(updatedOrder);
  } catch (error) {
    res.status(500).send({ message: "Failed to update the message" });
  }
};

const deleteRejectedOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order successfully deleted", deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

// *******************************************************************************************************************
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
    // console.log(order)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  updateOrderStatus,
  getPendingOrders,
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
  getOrderById,
};
