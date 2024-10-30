// routes/invoiceRoutes.js
const express = require("express");
const { createInvoice, getInvoicesByEmail } = require("../controllers/invoiceController");

const router = express.Router();

// POST request to create a new invoice
router.post("/", createInvoice);
router.get("/email",getInvoicesByEmail)

module.exports = router;
