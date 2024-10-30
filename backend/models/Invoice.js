const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    deliveryBefore: {
      type: Date,
      required: true,
    }, // Adding delivery date field
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
    },
    distributorName: {
      type: String,
      required: true,
    },
    distributorEmail: {
      type: String,
      required: true,
    },
    distributorPhone: {
      type: String,
      required: true,
    },
    distributorAddress: {
      type: String,
      required: true,
    },
    retailerName: {
      type: String,
      required: true,
    },
    retailerPhone: {
      type: String,
      required: true,
    },
    retailerEmail: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    retailerAddress: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      required: true,
    },
    product: {
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      productDescription: {
        type: String,
      },
      productImage: {
        type: String, // Storing the image URL or base64 string
      },
    },
    qrCodeImage: {
      type: String, // Storing the image URL or base64 string
    },
    netAmount: {
      type: Number,
      required: true,
    },
    authorizedSignature: {
      type: String, // You can store the signature as a string or image
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
