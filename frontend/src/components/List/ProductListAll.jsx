import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, ShoppingCart, Info, Filter, X } from "lucide-react";
import RetailerNavbar from "../Navbar/RetailerNavbar";

const productTypes = [
  "All",
  "Beauty",
  "Electronics",
  "Fashion",
  "Home Goods",
  "Health and Wellness",
  "Food and Beverage",
  "Sports and Outdoor Equipment",
  "Automotive",
  "Toys and Games",
  "Furniture",
];

const ProductListAll = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortType, setSortType] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products/all", {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        });
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred while fetching products.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let sorted = [...products];

    // Apply search filter
    if (searchTerm) {
      sorted = sorted.filter(product =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== "All") {
      sorted = sorted.filter(product => product.productType === selectedType);
    }

    // Apply sorting
    switch (sortType) {
      case "type":
        sorted.sort((a, b) => a.productType.localeCompare(b.productType));
        break;
      case "latest":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "inStock":
        sorted = sorted.filter(product => product.stock > 0);
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  }, [products, sortType, searchTerm, selectedType]);

  const handleMoreInfo = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}`, {
        method: "GET", // Specify the request method if needed (GET is default)
        credentials: "include", // Include credentials with the request
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedProduct(data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while fetching product details.");
    }
  };

  const handleAddToCart = (productId) => {
    // console.log(`Add to cart product ID: ${productId}`);
  };

  return (
    <>
      <RetailerNavbar />
      <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
          Product List
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
          <button
            className="md:hidden bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
            <span className="ml-2">
              {isFilterOpen ? "Close Filters" : "Open Filters"}
            </span>
          </button>
          <div
            className={`w-full md:w-2/3 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 ${
              isFilterOpen ? "block" : "hidden md:flex"
            }`}
          >
            <select
              className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
            >
              <option value="default">Sort by...</option>
              <option value="type">Type</option>
              <option value="latest">Latest</option>
              <option value="inStock">In Stock</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gray-800 text-white shadow-md rounded-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 duration-300"
            >
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold mb-2">
                  {product.productName}
                </h3>
                <p className="text-gray-400">Type: {product.productType}</p>
                <p className="text-gray-400">
                  Quantity: {product.quantity}
                </p>
                <p className="text-gray-400">
                  Price: ₹ {product.price.toFixed(2)}
                </p>
                <div className="mt-auto flex space-x-2">
                  <button
                    onClick={() => handleMoreInfo(product._id)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
                  >
                    <Info size={20} className="mr-2" />
                    More Info
                  </button>
                  <Link to={`/orderinfo/${product._id}`} className="flex-1">
                    <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center">
                      <ShoppingCart size={20} className="mr-2" />
                      Order
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full m-4">
              <h2 className="text-xl font-bold mb-4">
                Product: {selectedProduct.productName}
              </h2>
              <p className="mb-2">
                <strong>Distributor Name:</strong>{" "}
                {selectedProduct.distributorName}
              </p>
              <p className="mb-2">
                <strong>Distributor Email:</strong>{" "}
                {selectedProduct.distributorEmail}
              </p>
              <p className="mb-2">
                <strong>Description:</strong> {selectedProduct.description}
              </p>
              <p className="mb-2">
                <strong>Stock:</strong> {selectedProduct.stock}
              </p>
              <p className="mb-2">
                <strong>Price:</strong> ₹ {selectedProduct.price.toFixed(2)}
              </p>
              <p className="mb-4">
                <strong>Registered On:</strong>{" "}
                {new Date(selectedProduct.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductListAll;