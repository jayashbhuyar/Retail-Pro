const Network = require("../models/Network");
const User = require("../models/User"); // Assuming you have a User model
const mongoose = require("mongoose"); // Ensure mongoose is imported for ObjectId validation

// Controller to add a distributor to the network
exports.addToNetwork = async (req, res) => {
  const { distributorEmail, userEmail } = req.body;

  try {
    // Check if the distributor and user exist
    const distributor = await User.findOne({ email: distributorEmail });
    const user = await User.findOne({ email: userEmail });

    if (!distributor || !user) {
      return res.status(404).json({ error: "Distributor or user not found." });
    }

    // Check if the distributor is already in the network of the user
    const existingNetworkEntry = await Network.findOne({
      distributorEmail: distributorEmail,
      userEmail: userEmail,
    });

    if (existingNetworkEntry) {
      // If the distributor is already in the network, check the status
      if (existingNetworkEntry.status === "rejected") {
        // If the status is rejected, allow adding the distributor again
        existingNetworkEntry.status = "pending"; // Update status to pending
        await existingNetworkEntry.save(); // Save the updated entry
        return res.status(200).json({ message: "Distributor added to your network again." });
      } else {
        return res.status(400).json({ error: "Distributor is already in the network." });
      }
    }

    // Create a new network entry
    const newNetworkEntry = new Network({
      distributorId: distributor._id,
      distributorName: distributor.name,
      distributorEmail: distributor.email,
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      dist_img:distributor.image,
      retail_img:user.image,
      status: "pending", // Set the initial status to pending
      createdAt: new Date(),
    });

    // Save the new network entry to the database
    await newNetworkEntry.save();

    return res.status(200).json({ message: "Distributor added to your network." });
  } catch (error) {
    console.error("Error adding to network:", error);
    return res.status(500).json({ error: "An error occurred while adding to the network." });
  }
};

// Controller to update the status of a network request
exports.updateNetworkStatus = async (req, res) => {
  const { id } = req.params; // Network entry ID
  const { status } = req.body; // New status (accepted or rejected)

  // Validate status
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      error:
        "Invalid status value. It must be either 'accepted' or 'rejected'.",
    });
  }

  try {
    const networkEntry = await Network.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!networkEntry) {
      return res.status(404).json({ error: "Network entry not found." });
    }
    res.status(200).json({
      message: "Network request status updated successfully!",
      networkEntry,
    });
  } catch (error) {
    console.error("Error updating network status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the network request." });
  }
};

// Controller to get network requests by user email
exports.getNetworkRequests = async (req, res) => {
  const userEmail = req.query.userEmail; // Get user email from query parameters

  try {
    const requests = await Network.find({ userEmail }); // Fetch requests for the user
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching network requests:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching network requests." });
  }
};

// Controller to get pending requests by distributor email
exports.getPendingRequestsByEmail = async (req, res) => {
  const distributorEmail = req.query.email; // Get distributor email from query parameters

  try {
    const pendingRequests = await Network.find({
      distributorEmail,
      status: "pending",
    }); // Fetch pending requests
    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching pending requests." });
  }
};

// Controller to get accepted requests by distributor email
exports.getAcceptedRequestsByEmail = async (req, res) => {
  const { email } = req.query; // Get email from query params

  // Simple email validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const acceptedRequests = await Network.find({
      distributorEmail: email,
      status: "accepted",
    }); // Corrected to use Network
    res.status(200).json(acceptedRequests);
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    res.status(500).json({ error: "Error fetching accepted requests." });
  }
};
exports.getAcceptedRequestsRetailerByEmail = async (req, res) => {
  const { email } = req.query; // Get email from query params

  // Simple email validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const acceptedRequests = await Network.find({
      userEmail: email,
      status: "accepted",
    }); // Corrected to use Network
    res.status(200).json(acceptedRequests);
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
    res.status(500).json({ error: "Error fetching accepted requests." });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params; // Get the request ID from the URL parameters

  try {
    // Update the status of the request to "rejected"
    const updatedRequest = await Network.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Request not found." });
    }

    return res.status(200).json({ message: "Request rejected successfully.", request: updatedRequest });
  } catch (error) {
    console.error("Error rejecting request:", error);
    return res.status(500).json({ error: "An error occurred while rejecting the request." });
  }
};

exports.getAcceptedConnections = async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find networks where the email matches either distributor or user
    const networks = await Network.find({
      $and: [
        { status: 'accepted' },
        {
          $or: [
            { distributorEmail: email },
            { userEmail: email }
          ]
        }
      ]
    });
    
    res.json(networks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};