// productController.js
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

exports.addProduct = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.files || !req.files.image) {
      return res.status(400).json({ 
        success: false, 
        error: "Please select an image file" 
      });
    }

    const file = req.files.image;

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image file"
      });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "Image size should be less than 5MB"
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'products',
    });

    // Create new product
    const newProduct = new Product({
      imageUrl: result.secure_url,
      productType: req.body.productType,
      productName: req.body.productName,
      description: req.body.description,
      distributorName: req.body.distributorName,
      distributorEmail: req.body.distributorEmail,
      quantity: Number(req.body.quantity),
      price: Number(req.body.price),
      stock: Number(req.body.stock),
    });

    // Save to database
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product: newProduct
    });

  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred while adding the product."
    });
  }
};


// Controller to get products by distributor email
exports.getProductsByDistributorEmail = async (req, res) => {
  const { distributorEmail } = req.query;

  try {
    const products = await Product.find({ distributorEmail });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching products." });
  }
};

// Controller to get a product by its ID
exports.getProductById = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product." });
  }
};

exports.getDistributorByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find the product by ID and populate the distributor fields
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Assuming distributor information is stored directly in the product schema
    const distributorInfo = {
      name: product.distributorName,
      email: product.distributorEmail,
      img: product.imageUrl,
      productName: product.productName,
    };

    // Check if distributor information is available
    if (!distributorInfo.name || !distributorInfo.email) {
      return res
        .status(404)
        .json({ error: "Distributor information not found." });
    }

    res.status(200).json(distributorInfo);
  } catch (error) {
    console.error("Error fetching distributor info:", error);
    res.status(500).json({
      error: "An error occurred while fetching distributor information.",
    });
  }
};
// routes/productRoutes.js

// exports.updateStock = async (req, res) => {
//   const { distributorEmail1, productId, quantity } = req.body;
//   // console.log(productid);
//   try {
//     // Find product by distributorId and productId
//     const product = await Product.findById(productId );

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check stock availability
//     if (product.stock >= quantity) {
//       product.stock -= quantity; // Subtract quantity from stock
//       await product.save(); // Save updated product to the database
//       return res.status(200).json({ message: "Stock updated successfully" });
//     } else {
//       return res.status(400).json({ message: "Insufficient stock" ,stock});
//     }
//   } catch (error) {
//     console.error("Error updating stock:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
exports.updateStock = async (req, res) => {
  const { distributorEmail1, productId, quantity } = req.body;

  try {
    // Find product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock availability
    if (product.stock >= quantity) {
      product.stock -= quantity; // Subtract quantity from stock
      await product.save(); // Save updated product to the database
      return res.status(200).json({ message: "Stock updated successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Insufficient stock", stock: product.stock }); // Return actual available stock
    }
  } catch (error) {
    console.error("Error updating stock:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ***********************************
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while updating the product." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    res
      .status(400)
      .json({ error: "An error occurred while deleting the product." });
  }
};

// productsroutes.js or wherever you define your product routes
exports.updateRejectedStock = async (req, res) => {
  const { productId } = req.params;
  const { increment } = req.body; // `increment` will hold the quantity to add back to the stock
  // const objectId = new ObjectId(productId);
  // console.log(productId)
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increment the stock
    product.stock += increment;
    await product.save();

    res.status(200).json({ message: "Stock updated successfully", product });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Failed to update stock" });
  }
};

exports.getAllProductsByDistributorEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const products = await Product.find({ distributorEmail: email });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this distributor" });
    }

    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};
