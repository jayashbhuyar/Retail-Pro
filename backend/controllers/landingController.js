const Product = require("../models/Product");

const AllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching products." });
    }
  };
  module.exports=AllProducts;