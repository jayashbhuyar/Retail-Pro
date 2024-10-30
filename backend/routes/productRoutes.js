const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProductsByDistributorEmail,
  getAllProducts,
  getProductById,
  getDistributorByProductId,
  updateStock,
  updateProduct,
  deleteProduct,
  updateRejectedStock,
  getAllProductsByDistributorEmail,
} = require("../controllers/productController");

// const multer = require('multer');
// const path = require('path');
// const upload = require('../config/multerConfig'); // Adjust the path as needed
// const upload = require('../middleware/upload');

// const express = require("express");
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure uploads directory exists
//     const dir = 'uploads';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     // Create unique filename
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// Add file filter
// const fileFilter = (req, file, cb) => {
//   // Accept only image files
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Not an image! Please upload an image.'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// });

// Route configuration
router.post('/add',addProduct);


// GET endpoint to retrieve products by distributor email
router.get("/", getProductsByDistributorEmail);

// GET endpoint to retrieve all products
router.get("/all", getAllProducts);

// GET endpoint to retrieve a product by its ID
router.get("/:productId", getProductById);
router.get("/:productId/distributor", getDistributorByProductId);
//update stock
router.post("/update-stock", updateStock);

// *********************************************************
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.patch("/update-stock/:productId", updateRejectedStock);

router.get("/distributor/:email", getAllProductsByDistributorEmail);

module.exports = router;