import React, { useEffect, useState } from "react";
import axios from "axios";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import { Trash2, RefreshCw, Package, DollarSign, User, Mail, CheckCircle,IndianRupeeIcon } from 'lucide-react';
import { Link } from "react-router-dom";

const CompletedRetail = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("userdata")
    ? JSON.parse(localStorage.getItem("userdata")).email
    : null;

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/orders/completed-by-email?userEmail=${userEmail}`,{
            withCredentials:true
          }
        );
        setCompletedOrders(response.data);
      } catch (err) {
        setError("Failed to fetch completed orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchCompletedOrders();
    }
  }, [userEmail]);

  const handleRemoveOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8000/api/orders/delete-rejected/${orderId}`,{
        withCredentials:true
      });
      setCompletedOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    } catch (err) {
      setError("Failed to remove the order. Please try again.");
    }
  };

  const handleReOrder = (orderId) => {
    console.log(`Re-order for order with ID: ${orderId}`);
    // Implement re-order functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <RetailerNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-indigo-300 mb-6">Completed Orders</h1>
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        {completedOrders.length === 0 ? (
          <p className="text-gray-400 text-lg">No completed orders found.</p>
        ) : (
          <ul className="space-y-4">
            {completedOrders.map((order) => (
              <li key={order._id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-indigo-300">{order.productName}</h2>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-100">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="flex items-center text-gray-300">
                        <User className="w-5 h-5 mr-2 text-blue-400" />
                        <span className="font-medium">Distributor:</span> {order.distributorName}
                      </p>
                      <p className="flex items-center text-gray-300 mt-2">
                        <Mail className="w-5 h-5 mr-2 text-green-400" />
                        <span className="font-medium">Email:</span> {order.distributorEmail}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center text-gray-300">
                        <Package className="w-5 h-5 mr-2 text-yellow-400" />
                        <span className="font-medium">Quantity:</span> {order.quantity}
                      </p>
                      <p className="flex items-center text-gray-300 mt-2">
                        <IndianRupeeIcon className="w-5 h-5 mr-2 text-pink-400" />
                        <span className="font-medium">Price :</span> {order.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleRemoveOrder(order._id)}
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Remove
                    </button>
                    <Link to="/productlistall">
                    <button
                      onClick={() => handleReOrder(order._id)}
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Re-Order
                    </button></Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CompletedRetail;