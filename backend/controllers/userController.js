const User = require("../models/User");

// Get all retailers
exports.getAllRetailers = async (req, res) => {
  try {
    const retailers = await User.find({ role: "retailer" });
    res.status(200).json(retailers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching retailers." });
  }
};

// Get all distributors
exports.getAllDistributors = async (req, res) => {
  try {
    const distributors = await User.find({ role: "distributor" });
    res.status(200).json(distributors);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching distributors." });
  }
};


exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email })
      .select('name email phone companyName image address createdAt');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'An error occurred while fetching user data.' });
  }
};

exports.deleteRetailer = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the retailer by ID
    const retailer = await User.findByIdAndDelete(id);
    if (!retailer) {
      return res.status(404).json({ error: "Retailer not found" });
    }

    res.status(200).json({ message: "Retailer deleted successfully" });
  } catch (error) {
    console.error("Error deleting retailer:", error);
    res.status(500).json({ error: "Server error while deleting retailer" });
  }
};

exports.deleteDistributor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the retailer by ID
    const distributor = await User.findByIdAndDelete(id);
    if (!distributor) {
      return res.status(404).json({ error: "Retailer not found" });
    }

    res.status(200).json({ message: "Retailer deleted successfully" });
  } catch (error) {
    console.error("Error deleting retailer:", error);
    res.status(500).json({ error: "Server error while deleting retailer" });
  }
};