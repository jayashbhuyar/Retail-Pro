const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema({
  distributorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the distributor
  distributorName: { type: String, required: true }, // Name of the distributor
  distributorEmail: { type: String, required: true }, // Email of the distributor
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  userName: { type: String, required: true }, // Name of the user
  userEmail: { type: String, required: true },
  dist_img: {type: String},
  retail_img: {type: String},
   // Email of the user
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  }, // Status of the request
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the network entry was created
});

// Create the Network model
const Network = mongoose.model("Network", networkSchema);
module.exports = Network;
