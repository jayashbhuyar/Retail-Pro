const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    distributorName: {
      type: String,
    },
    distributorEmail: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    userPhone: {
      type: String,
    },
    shopName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    msg: {
      type: String,
    },
    deliveryBefore: {
      type: Date,
    },
    orderCancelReason: {
      type: String,
      default: null,
    },
    retailerAddress: {
      type: String,
    },
    img: {
      type: String,
    },
    productName: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    completedOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
