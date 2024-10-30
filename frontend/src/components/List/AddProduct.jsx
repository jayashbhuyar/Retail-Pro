import React, { useState } from "react";
import DistributorsNavbar from "../Navbar/DistributorsNavbar";
import {
  ChevronDown,
  Package,
  DollarSign,
  Truck,
  Upload,
  IndianRupeeIcon,
} from "lucide-react";

const AddProduct = () => {
  const [imageFile, setImageFile] = useState(null);
  const [productType, setProductType] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userdata")) || {};
  const distributorName = userData.name || "";
  const distributorEmail = userData.email || "";

  const productTypes = [
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

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file && !file.type.startsWith('image/')) {
  //     setError('Please upload an image file');
  //     return;
  //   }
  //   setImageFile(file);
  //   setError(null); // Clear any previous errors
  // };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setImageFile(null);
      setError('Please select an image file');
      return;
    }
  
    // Check file type
    if (!file.type.startsWith('image/')) {
      setImageFile(null);
      setError('Please upload an image file (JPEG, PNG, GIF)');
      return;
    }
  
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setImageFile(null);
      setError('Image file must be smaller than 5MB');
      return;
    }
  
    setImageFile(file);
    setError(null);
  };
  const clearForm = () => {
    setImageFile(null);
    setProductType("");
    setProductName("");
    setDescription("");
    setQuantity(0);
    setPrice(0);
    setStock(0);
  };

  // const uploadImageToCloudinary = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("upload_preset", "my_upload_preset"); // Your Cloudinary upload preset

  //   const response = await fetch(
  //     "https://api.cloudinary.com/v1_1/dlx3l4a9p/image/upload",
  //     {
  //       method: "POST",
  //       body: formData,
  //     },
  //     {
  //       credentials:"include"
  //     }
     
  //   );

  //   if (!response.ok) throw new Error("Image upload failed");
  //   const data = await response.json();
  //   return data.secure_url;
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(null);
  //   setIsLoading(true);

  //   try {
  //     // First upload image to Cloudinary
  //     let imageUrl = null;
  //     if (imageFile) {
  //       try {
  //         imageUrl = await uploadImageToCloudinary(imageFile);
  //       } catch (uploadError) {
  //         throw new Error("Failed to upload image. Please try again.");
  //       }
  //     }

  //     // Create product with image URL
  //     const formData = new FormData();
  //     if (imageUrl) formData.append("imageUrl", imageUrl);
  //     formData.append("productType", productType);
  //     formData.append("productName", productName);
  //     formData.append("description", description);
  //     formData.append("distributorName", distributorName);
  //     formData.append("distributorEmail", distributorEmail);
  //     formData.append("quantity", quantity);
  //     formData.append("price", price);
  //     formData.append("stock", stock);

  //     const response = await fetch("http://localhost:8000/api/products/add", {
  //       method: "POST",
  //       body: formData,
  //       credentials: "include",
  //     });

  //     const data = await response.json();

  //     if (data.success) {
  //       setSuccess(data.message || "Product added successfully!");
  //       clearForm();
  //     } else {
  //       throw new Error(data.error || "Failed to add product");
  //     }
  //   } catch (error) {
  //     console.error("Product creation error:", error);
  //     setError(error.message || "An error occurred while adding the product.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError(null);
  //   setSuccess(null);
  //   setIsLoading(true);
  
  //   try {
  //     if (!imageFile) {
  //       throw new Error("Please select an image file");
  //     }
  
  //     const formData = new FormData();
  //     formData.append("image", imageFile);
  //     formData.append("productType", productType);
  //     formData.append("productName", productName);
  //     formData.append("description", description);
  //     formData.append("distributorName", distributorName);
  //     formData.append("distributorEmail", distributorEmail);
  //     formData.append("quantity", quantity);
  //     formData.append("price", price);
  //     formData.append("stock", stock);
  
  //     const response = await fetch("http://localhost:8000/api/products/add", {
  //       method: "POST",
  //       body: formData,
  //       // Remove the credentials include if you're not using sessions
  //       // credentials: "include",
  //     });
  
  //     const data = await response.json();
      
  //     if (!data.success) {
  //       throw new Error(data.error || "Failed to add product");
  //     }
  
  //     setSuccess(data.message || "Product added successfully!");
  //     clearForm();
  //   } catch (error) {
  //     console.error("Product creation error:", error);
  //     setError(error.message || "An error occurred while adding the product");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);
  
    try {
      if (!imageFile) {
        throw new Error("Please select an image file");
      }
  
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("productType", productType);
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("distributorName", distributorName);
      formData.append("distributorEmail", distributorEmail);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("stock", stock);
  
      // Get the token from localStorage
      const token = localStorage.getItem('token');
  
      const response = await fetch("http://localhost:8000/api/products/add", {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`, // Add the token to headers
        },
        credentials: 'include', // Include cookies
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to add product");
      }
  
      setSuccess(data.message);
      clearForm();
    } catch (error) {
      console.error("Product creation error:", error);
      setError(error.message || "An error occurred while adding the product");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <DistributorsNavbar />
      <div className="container mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-105">
          <div className="flex flex-col md:flex-row">
            <div className="md:flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center p-4 md:p-8">
              <Upload className="h-20 w-20 md:h-32 md:w-32 text-white animate-pulse" />
            </div>
            <div className="p-4 md:p-8 w-full">
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4 md:mb-6">
                Add Your Product
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 gap-y-4 md:gap-y-6 gap-x-4 md:grid-cols-2">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Image
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                        <Upload className="h-4 w-4 md:h-5 md:w-5" />
                      </span>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        required
                        accept="image/*"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Product Type
                    </label>
                    <div className="mt-1 relative">
                      <select
                        value={productType}
                        onChange={(e) => setProductType(e.target.value)}
                        required
                        className="bg-gray-700 block w-full pl-3 pr-10 py-2 text-sm border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-gray-100"
                      >
                        <option value="">Select type</option>
                        {productTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      placeholder="Enter product name"
                      className="mt-1 bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-600 rounded-md text-gray-100"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="Enter product description"
                      rows={3}
                      className="mt-1 bg-gray-700 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm border-gray-600 rounded-md text-gray-100"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Quantity
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        min="0"
                        className="bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 text-sm border-gray-600 rounded-md text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IndianRupeeIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        className="bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 text-sm border-gray-600 rounded-md text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Stock
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Truck className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        min="0"
                        className="bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 text-sm border-gray-600 rounded-md text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Distributor Name
                    </label>
                    <input
                      type="text"
                      value={distributorName}
                      readOnly
                      className="mt-1 bg-gray-600 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-sm border-gray-600 rounded-md text-gray-300"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-300">
                      Distributor Email
                    </label>
                    <input
                      type="email"
                      value={distributorEmail}
                      readOnly
                      className="mt-1 bg-gray-600 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-sm border-gray-600 rounded-md text-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Adding Product..." : "Add Product"}
                  </button>
                </div>
              </form>

              {error && (
                <p className="mt-4 text-center text-sm text-red-400 bg-red-900 rounded-md p-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="mt-4 text-center text-sm text-green-400 bg-green-900 rounded-md p-2">
                  {success}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;