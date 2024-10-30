const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // URL of the product image
  productType: { type: String, required: true }, // Type of the product (e.g., electronics, clothing)
  productName: { type: String, required: true }, // Name of the product
  distributorName: { type: String, required: true }, // Name of the distributor
  distributorEmail: { type: String, required: true }, // Email of the distributor
  quantity: { type: Number, required: true, min: 0 }, // Quantity of the product
  price: { type: Number, required: true, min: 0 }, // Price of the product
  stock: { type: Number, required: true, min: 1 }, // Price of the product
  description: { type: String, required: true }, // Description of the product
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the product was added
});

// Create the Product model
const Product = mongoose.model("Product", productSchema);
module.exports = Product;