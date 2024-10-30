import React, { useEffect, useState } from "react";
import axios from "axios";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";

const PendingRetailer = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem("userdata")
    ? JSON.parse(localStorage.getItem("userdata")).email
    : null;

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/orders/pending-by-email?userEmail=${userEmail}`,
          { withCredentials: true }
        );
        setPendingOrders(response.data);
      } catch (err) {
        setError("Failed to fetch pending orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchPendingOrders();
    }
  }, [userEmail]);

  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Please enter the reason for cancellation:");
    if (reason) {
      const message = `Cancelled by Retailer. Reason: ${reason}`;
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/orders/retail/status/${orderId}`,
          { status: "cancelled", msg: message },
          { withCredentials: true }
        );
        const { productId, quantity } = response.data;
        await axios.patch(
          `http://localhost:8000/api/products/update-stock/${productId}`,
          { increment: quantity },
          { withCredentials: true }
        );
        setPendingOrders(pendingOrders.filter((order) => order._id !== orderId));
      } catch (err) {
        console.error("Error cancelling order or updating stock:", err);
        setError("Failed to cancel the order and update product stock.");
      }
    }
  };

  const handleUpdateMessage = async (orderId) => {
    const newMessage = prompt("Please enter the new message:");
    if (newMessage) {
      try {
        await axios.patch(
          `http://localhost:8000/api/orders/retail/msg/${orderId}`,
          { msg: newMessage },
          { withCredentials: true }
        );
        const updatedOrders = pendingOrders.map((order) =>
          order._id === orderId ? { ...order, msg: newMessage } : order
        );
        setPendingOrders(updatedOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to update the message.");
      }
    }
  };

  if (loading) {
    return <p>Loading pending orders...</p>;
  }

  return (
    <>
      <RetailerNavbar />
      <div className="container mx-auto p-6 bg-gray-800 min-h-screen">
        <h1 className="text-3xl font-bold text-purple-400 mb-6">Pending Orders</h1>
        {error && <p className="text-red-500">{error}</p>}
        {pendingOrders.length === 0 ? (
          <p className="text-yellow-300">No pending orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left text-white bg-gray-700 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-gray-600 text-gray-200">
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Distributor Name</th>
                  <th className="p-3">Distributor Email</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price (₹)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map((order) => (
                  <tr key={order._id} className="bg-gray-700 border-b border-gray-600">
                    <td className="p-3">
                      <img
                        src={order.img}
                        alt={order.productName}
                        className="w-16 h-16 object-cover rounded-full mx-auto"
                      />
                    </td>
                    <td className="p-3">{order.productName}</td>
                    <td className="p-3">{order.distributorName}</td>
                    <td className="p-3">{order.distributorEmail}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">₹ {order.price}</td>
                    <td className="p-3 text-red-500">{order.status}</td>
                    <td className="p-3 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateMessage(order._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500 transition duration-200"
                      >
                        Update Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingRetailer;
