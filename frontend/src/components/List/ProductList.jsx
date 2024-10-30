import React, { useEffect, useState } from "react";
import DistributorsNavbar from "../Navbar/DistributorsNavbar";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const distributorEmail = JSON.parse(localStorage.getItem("userdata"))?.email || "";

  useEffect(() => {
    fetchProducts();
  }, [distributorEmail]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products?distributorEmail=${distributorEmail}`, {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        }
      );
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while fetching products.");
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`,
        {
          method: "DELETE",
          credentials: "include", // Include credentials with the request
        }
      
      );

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while deleting the product.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingProduct),
          credentials: "include", // Include credentials with the request
         
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setEditingProduct(null);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while updating the product.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  return (
    <>
      <DistributorsNavbar />
      <div className="bg-gray-900 min-h-screen p-4">
        <h2 className="text-3xl font-bold mb-4 text-indigo-400">Product List</h2>
        {error && <p className="text-red-400">{error}</p>}
        <div className="container mx-auto p-4 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-gray-800 shadow-lg rounded-lg p-4 hover:scale-105 transition-transform transform"
              >
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="h-48 w-full object-cover rounded-t-lg mb-4"
                  style={{ objectFit: 'cover' }}
                />
                <div className="px-4">
                  <h3 className="text-lg font-bold text-teal-400">
                    {product.productName}
                  </h3>
                  <p className="text-gray-300">Type: {product.productType}</p>
                  <p className="text-gray-300">
                    Description: {product.description}
                  </p>
                  <p className="text-gray-300">Quantity: {product.quantity}</p>
                  <p className="text-gray-300">
                    Price: ₹ {product.price.toFixed(2)}
                  </p>
                  <p className={product.stock <= 10 ? "text-red-500" : "text-gray-300"}>
                    {product.stock <= 10 ? `Insufficient stock ${product.stock} Pcs`: `Stock: ${product.stock.toFixed(0)} Pcs`}
                  </p>
                </div>
                <div className="mt-auto flex space-x-2 p-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editingProduct && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-100">Edit Product</h3>
                <form onSubmit={handleUpdate} className="mt-2 text-left">
                  <input
                    type="text"
                    name="productName"
                    value={editingProduct.productName}
                    onChange={handleInputChange}
                    placeholder="Product Name"
                    className="mt-2 p-2 w-full bg-gray-700 text-gray-100 rounded"
                  />
                  <input
                    type="text"
                    name="productType"
                    value={editingProduct.productType}
                    onChange={handleInputChange}
                    placeholder="Product Type"
                    className="mt-2 p-2 w-full bg-gray-700 text-gray-100 rounded"
                  />
                  <textarea
                    name="description"
                    value={editingProduct.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="mt-2 p-2 w-full bg-gray-700 text-gray-100 rounded"
                  />
                  <input
                    type="number"
                    name="quantity"
                    value={editingProduct.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    className="mt-2 p-2 w-full bg-gray-700 text-gray-100 rounded"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="mt-2 p-2 w-full bg-gray-700 text-gray-100 rounded"
                  />
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={handleInputChange}
                    placeholder="Stock"
                    className="mt-2 p-2 w-full bg-gray-700 text-gray-100 rounded"
                  />
                  <div className="items-center px-4 py-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;