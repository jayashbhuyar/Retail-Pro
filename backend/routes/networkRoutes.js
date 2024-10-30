const express = require("express");
const {
  addToNetwork,
  updateNetworkStatus,
  getNetworkRequests,
  getPendingRequestsByEmail,
  getAcceptedRequestsByEmail,
  getAcceptedRequestsRetailerByEmail,
  updateRequestStatus,
  getAcceptedConnections,
} = require("../controllers/networkcontroller");
const router = express.Router();

//api/network/
// POST endpoint to add a distributor to the network
router.post("/add", addToNetwork);

router.put("/reject/status/:id", updateRequestStatus);
router.get("/accepted/:email", getAcceptedConnections);
// PUT endpoint to update the status of a network request
router.put("/status/:id", updateNetworkStatus);

// GET endpoint to fetch network requests by user email
router.get("/", getNetworkRequests);

// GET endpoint to fetch pending requests by distributor email
router.get("/pending", getPendingRequestsByEmail);
router.get("/all/accepted/retailer", getAcceptedRequestsRetailerByEmail);
router.get("/accepted", getAcceptedRequestsByEmail);
module.exports = router;