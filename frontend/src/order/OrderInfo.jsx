import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import { AlertCircle, ShoppingCart, LogIn } from "lucide-react";

const OrderInfo = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [distributorInfo, setDistributorInfo] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [distributorEmail1, setDistributorEmail1] = useState(null);
  const [alertInfo, setAlertInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`, {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        }
      );
      const data = await response.json();
      setProduct(data);
    };

    const fetchDistributorInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${productId}/distributor`, {
            method: "GET", // Specify the request method if needed (GET is default)
            credentials: "include", // Include credentials with the request
          }
        );
       
        if (!response.ok) {
          throw new Error("Failed to fetch distributor info");
        }

        const data = await response.json();
        setDistributorInfo(data);
        setDistributorEmail1(data.email);
      } catch (error) {
        console.error("Error fetching distributor info:", error);
      }
    };

    fetchProduct();
    fetchDistributorInfo();
  }, [productId]);

  const handleOrder = async () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    const retailerId = userData?.id;
    const missingFields = [];
  
    if (!retailerId) {
      setAlertInfo({
        type: "error",
        title: "Authentication Required",
        message: "Please log in to place an order.",
        icon: <LogIn className="h-6 w-6 text-red-600" />,
        requiresAuth: true
      });
      return;
    }
  
    if (!productId) missingFields.push("Product ID");
    if (quantity <= 0) missingFields.push("Quantity (must be greater than 0)");
    if (!message) missingFields.push("Message");

    if (missingFields.length > 0) {
      setAlertInfo({
        type: "warning",
        title: "Missing Information",
        message: `Please provide: ${missingFields.join(", ")}`,
        icon: <AlertCircle className="h-6 w-6 text-yellow-600" />
      });
      return;
    }

    const stockUpdateResult = await updateDistributorStock(distributorEmail1, productId, quantity);

    if (!stockUpdateResult) return;

    const orderData = {
      distributorName: distributorInfo.name,
      distributorEmail: distributorInfo.email,
      userId: userData.id,
      img: distributorInfo.img,
      productName: distributorInfo.productName,
      userName: userData?.name,
      userEmail: userData?.email,
      userPhone: userData?.phone,
      shopName: userData?.shopName,
      quantity,
      price: product.price,
      msg: message,
      deliveryBefore: null,
      orderCancelReason: null,
      retailerAddress: userData?.address,
      productId: productId
    };

    try {
      const response = await fetch('http://localhost:8000/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include", // Include credentials with the request
        body: JSON.stringify(orderData),
        
      });

      if (response.ok) {
        setAlertInfo({
          type: "success",
          title: "Order Placed",
          message: "Your order has been placed successfully!",
          icon: <ShoppingCart className="h-6 w-6 text-green-600" />
        });
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setAlertInfo({
        type: "error",
        title: "Order Failed",
        message: "There was an error placing your order. Please try again.",
        icon: <AlertCircle className="h-6 w-6 text-red-600" />
      });
    }
  };

  const updateDistributorStock = async (distributorEmail1, productId, quantity) => {
    try {
      const response = await fetch('http://localhost:8000/api/products/update-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:"include",
        body: JSON.stringify({
          distributorEmail1,
          productId,
          quantity,
        }),
      });

      const contentType = response.headers.get('content-type');
      const result = contentType && contentType.includes('application/json')
        ? await response.json()
        : null;

      if (!response.ok) {
        if (result && result.message === 'Insufficient stock') {
          setAlertInfo({
            type: "error",
            title: "Insufficient Stock",
            message: `Available stock: ${result.stock}`,
            icon: <AlertCircle className="h-6 w-6 text-red-600" />
          });
          return false;
        } else {
          throw new Error(result?.message || 'Failed to update stock');
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      setAlertInfo({
        type: "error",
        title: "Stock Update Failed",
        message: "There was an error updating the stock. Please try again.",
        icon: <AlertCircle className="h-6 w-6 text-red-600" />
      });
      return false;
    }
  };
  
  return (
    <>
      <RetailerNavbar />
      <div className="container mx-auto p-6 bg-gray-900 min-h-screen">
        {alertInfo && (
          <div className={`mb-4 p-4 rounded-lg ${
            alertInfo.type === 'error' ? 'bg-red-100 text-red-800' :
            alertInfo.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            <div className="flex items-center">
              {alertInfo.icon}
              <div className="ml-3">
                <h3 className="text-sm font-medium">{alertInfo.title}</h3>
                <div className="mt-2 text-sm">{alertInfo.message}</div>
                {alertInfo.requiresAuth && (
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => navigate('/auth/login')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/auth/signup')}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {product ? (
          <div className="bg-gray-800 text-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">
              {product.productName}
            </h1>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 md:ml-8">
                <p className="text-gray-300 text-lg mb-4">
                  {product.description}
                </p>
                <p className="text-2xl font-semibold text-gray-200 mb-4">
                  Price: ₹ {product.price.toFixed(2)}
                </p>

                <div className="flex items-center mb-4">
                  <label
                    htmlFor="quantity"
                    className="mr-3 text-lg font-medium text-gray-300"
                  >
                    Quantity:
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="border border-gray-600 rounded-md p-2 w-20 text-lg bg-gray-700 text-white"
                  />
                </div>

                <div className="mb-4">
                  <textarea
                    placeholder="Leave a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border border-gray-600 rounded-md p-3 w-full h-32 resize-none text-lg bg-gray-700 text-white shadow-sm"
                  />
                </div>

                <button
                  onClick={handleOrder}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2" />
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-lg text-gray-300">
            Loading product information...
          </div>
        )}
      </div>
    </>
  );
};

export default OrderInfo;