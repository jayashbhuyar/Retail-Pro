import React, { useEffect, useState } from "react";
import axios from "axios";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import { Trash2, Package, DollarSign, User, Mail, AlertTriangle ,IndianRupeeIcon} from 'lucide-react';

const RejectedRetail = () => {
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem("userdata")
    ? JSON.parse(localStorage.getItem("userdata")).email
    : null;

  useEffect(() => {
    const fetchRejectedOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/orders/rejected-by-email?userEmail=${userEmail}`,{
            withCredentials:true
          }
        );
        setRejectedOrders(response.data);
      } catch (err) {
        setError("Failed to fetch rejected orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchRejectedOrders();
    }
  }, [userEmail]);

  const handleRemoveOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8000/api/orders/delete-rejected/${orderId}`,{
        withCredentials:true
      });
      setRejectedOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    } catch (err) {
      setError("Failed to remove the order. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-gray-300">Loading rejected orders...</p>;
  }

  return (
    <>
      <RetailerNavbar />
      <div className="container mx-auto p-6 bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">Rejected Orders</h1>
        {error && <p className="text-red-400">{error}</p>}
        {rejectedOrders.length === 0 ? (
          <p className="text-yellow-300">No rejected orders found.</p>
        ) : (
          <ul className="space-y-6">
            {rejectedOrders.map((order) => (
              <li key={order._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4">
                    <img
                      src={order.img}
                      alt={order.productName}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="w-full md:w-3/4 p-4">
                    <h2 className="text-xl font-semibold text-purple-300 mb-2">{order.productName}</h2>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-400" />
                        <span className="font-medium">Distributor:</span> {order.distributorName}
                      </li>
                      <li className="flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-green-400" />
                        <span className="font-medium">Email:</span> {order.distributorEmail}
                      </li>
                      <li className="flex items-center">
                        <Package className="w-5 h-5 mr-2 text-yellow-400" />
                        <span className="font-medium">Quantity:</span> {order.quantity}
                      </li>
                      <li className="flex items-center">
                        <IndianRupeeIcon className="w-5 h-5 mr-2 text-pink-400" />
                        <span className="font-medium">Price : </span> ₹ {order.price}
                      </li>
                      <li className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                        <span className="font-medium">Cancel Reason:</span> {order.orderCancelReason || 'Not provided'}
                      </li>
                    </ul>
                    <div className="mt-4">
                      <button
                        onClick={() => handleRemoveOrder(order._id)}
                        className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out"
                      >
                        <Trash2 className="w-5 h-5 mr-2" />
                        Remove Order
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default RejectedRetail;