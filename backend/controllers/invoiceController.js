// controllers/invoiceController.js
const Invoice = require("../models/Invoice");

const createInvoice = async (req, res) => {
  try {
    const {
      invoiceNo,
      distributorName,
      distributorEmail,
      distributorPhone,
      distributorAddress,
      companyName,
      retailerName,
      retailerEmail,
      retailerPhone,
      shopName,
      retailerAddress,
      orderStatus,
      productName,
      quantity,
      price,
      productDescription,
      productImage,
      qrCodeImage,
      netAmount,
      authorizedSignature,
      deliveryBefore,
    } = req.body;

    // Create a new invoice instance
    const newInvoice = new Invoice({
      invoiceNo,
      distributorName,
      distributorEmail,
      distributorPhone,
      distributorAddress,
      companyName,
      retailerName,
      retailerEmail,
      retailerPhone,
      shopName,
      retailerAddress,
      deliveryBefore,
      orderStatus,
      product: {
        // Nest the product details in the product object
        productName,
        quantity,
        price,
        total: quantity * price, // Calculate total dynamically
        productDescription,
        productImage,
      },
      qrCodeImage,
      netAmount,
      authorizedSignature,
    });

    // Save the invoice to the database
    const savedInvoice = await newInvoice.save();

    // Return the saved invoice
    res.status(201).json({
      message: "Invoice created successfully",
      invoice: savedInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error); // Log the entire error object
    res.status(500).json({
      message: "Failed to create invoice",
      error: error.message,
      validationErrors: error.errors || null, // Return validation errors if any
    });
  }
};
const getInvoicesByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const invoices = await Invoice.find({
        retailerEmail: email,
        orderStatus: "accepted",
      });
      

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Error fetching invoices" });
  }
};

module.exports = {
  createInvoice,
  getInvoicesByEmail,
};
