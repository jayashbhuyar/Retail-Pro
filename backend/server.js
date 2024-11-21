const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); // Add this
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const networkRoutes = require("./routes/networkRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const newsRoutes = require("./routes/newsRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const otpRoutes = require("./routes/otpRoutes");
const chatRoutes = require("./routes/chatRoutes");
const landingpageRoutes = require("./routes/landingpageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const { verifyToken, validate } = require("./middleware/verify");
// const uploadRoutes = require('./routes/uploadRoutes');

// Load environment variables
dotenv.config();
const fileUpload = require("express-fileupload");
// const { uploadQRCode } = require("./controllers/uploadController");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests only from this origin
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Add cookie parser

// ##########################################
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

// app.use('/api/upload', uploadRoutes);
app.use("/api/landingpage", landingpageRoutes);
app.use("/api/upload/", uploadRoutes);
app.use("/api/otp", otpRoutes);
app.use("/passchange/api/otp", otpRoutes);
app.use("/api/auth", authRoutes);
app.post("/api/validate", validate);
app.use("/pass/auth",verifyToken, authRoutes);
app.use("/api/users", verifyToken, userRoutes);
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/network", verifyToken, networkRoutes);
app.use("/api/orders", verifyToken, orderRoutes);
app.use("/admin", verifyToken, adminRoutes);
app.use("/api", verifyToken, feedbackRoutes);
app.use("/api/invoices", verifyToken, invoiceRoutes);
app.use("/api/news", verifyToken, newsRoutes);

// ***************************************************************************************
app.use("/api/chat", chatRoutes);

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
