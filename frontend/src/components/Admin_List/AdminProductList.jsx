import React, { useEffect, useState } from "react";
// import AdminNavbar from "../Navbar/AdminNavbar"; // Assuming you have an Admin Navbar
import AdminNav from "../Navbar/AdminNav";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products/all", {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        }); // Adjust endpoint if needed
        const data = await response.json();
        if (response.ok) {
          setProducts(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchProducts();
  };

  return (
    <>
    <AdminNav/>
    <div className="bg-gray-900 h-screen">
      {/* <AdminNavbar /> */}
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold text-purple-400 mb-4">Product List</h1>
        {loading && (
          <p className="text-blue-500 text-center">Loading products...</p>
        )}
        {error && (
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button onClick={handleRetry} className="text-blue-500 underline">
              Retry
            </button>
          </div>
        )}

        {/* Table layout for displaying products */}
        <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-4">Product Name</th>
              <th className="p-4">Distributor Name</th>
              <th className="p-4">Distributor Email</th>
              <th className="p-4">Product Type</th>
              <th className="p-4">Price</th>
              <th className="p-4">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t border-gray-700">
                <td className="p-4">{product.productName}</td>
                <td className="p-4">{product.distributorName}</td>
                <td className="p-4">{product.distributorEmail}</td>
                <td className="p-4">{product.productType}</td>
                <td className="p-4">₹:{product.price.toFixed(2)}</td>
                <td className="p-4">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminProductList;
