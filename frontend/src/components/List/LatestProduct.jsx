import React, { useEffect, useState } from "react";
import RetailerNavbar from "../Navbar/RetailerNavbar";

const LatestProducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products/all", {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        }); // Adjust the endpoint as necessary
        const data = await response.json();
        if (response.ok) {
          // Sort products by createdAt date in descending order
          const sortedProducts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setLatestProducts(sortedProducts);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred while fetching the latest products.");
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <>
   <RetailerNavbar/>
    <div className="bg-gray-900 min-h-screen p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Latest Products</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {latestProducts.map((product) => (
          <div
            key={product._id}
            className="bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col transform hover:scale-105 transition-transform duration-300"
          >
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="h-48 w-full object-cover rounded-md mb-4 shadow-md"
            />
            <h3 className="text-lg font-bold text-white mb-2">{product.productName}</h3>
            <p className="text-gray-400">Type: {product.productType}</p>
            <p className="text-gray-400">Price: ₹{product.price.toFixed(2)}</p>
            <p className="text-gray-400">Quantity: {product.quantity}</p>
            <p className="text-gray-400">Created At: {new Date(product.createdAt).toLocaleDateString()}</p>
            {/* <div className="mt-auto flex space-x-2 pt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
                More Info
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200">
                Order
              </button>
              <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-200">
                Add to Cart
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default LatestProducts;
