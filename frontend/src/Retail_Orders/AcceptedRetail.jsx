import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, MessageCircle, Loader } from "lucide-react";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";

const AcceptedRetail = () => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);

  const userEmail = localStorage.getItem("userdata")
    ? JSON.parse(localStorage.getItem("userdata")).email
    : null;

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/orders/accepted-by-email?userEmail=${userEmail}`,
          {
            withCredentials: true
          }
        );
        setAcceptedOrders(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch accepted orders.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchAcceptedOrders();
    }
  }, [userEmail]);

  const handleUpdateMessage = (orderId) => {
    setEditingOrderId(orderId);
  };

  const handleSubmitUpdateMessage = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/orders/update-message/${orderId}`,
        { newMessage },
        {
          withCredentials: true
        }
      );
      console.log(response.data);
      setAcceptedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, msg: newMessage } : order
        )
      );
      setEditingOrderId(null);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to update the message", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 to-indigo-900">
        <Loader className="animate-spin h-12 w-12 text-purple-400" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 min-h-screen">
      <RetailerNavbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-purple-300 mb-8 text-center">
          Accepted Orders
        </h1>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-r" role="alert">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {acceptedOrders.length === 0 ? (
          <div className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 mb-6 rounded-r" role="alert">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
              <p>No accepted orders found.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden hidden md:table">
              <thead>
                <tr className="bg-gray-900">
                  <th className="p-4 text-left text-purple-300">Product</th>
                  <th className="p-4 text-left text-purple-300">Distributor</th>
                  <th className="p-4 text-left text-purple-300 hidden lg:table-cell">Email</th>
                  <th className="p-4 text-left text-purple-300">Details</th>
                  <th className="p-4 text-left text-purple-300">Message</th>
                  <th className="p-4 text-left text-purple-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {acceptedOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-700 hover:bg-gray-700">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.img}
                          alt={order.productName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="text-purple-300 font-medium">
                          {order.productName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-purple-300">{order.distributorName}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-purple-300">{order.distributorEmail}</span>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-teal-300">Qty: {order.quantity}</p>
                        <p className="text-teal-300">₹{order.price}</p>
                        <p className="text-green-300">{order.status}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {editingOrderId === order._id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Enter new message"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                          />
                          <button
                            onClick={() => handleSubmitUpdateMessage(order._id)}
                            className="w-full bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200"
                          >
                            Submit
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-300">{order.msg || "No message"}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleUpdateMessage(order._id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Update Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card View */}
            <div className="space-y-4 md:hidden">
              {acceptedOrders.map((order) => (
                <div key={order._id} className="bg-gray-800 rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={order.img}
                      alt={order.productName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-purple-300 font-medium">{order.productName}</h3>
                      <h2 className="text-green-400 font-medium">Distributor Info:</h2>
                      <p className="text-purple-300 text-sm">{order.distributorName}</p>
                      <p className="text-purple-300 text-sm">{order.distributorEmail}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-teal-300">Quantity: {order.quantity}</div>
                    <div className="text-teal-300">Price: ₹{order.price}</div>
                    <div className="text-green-300">Status: {order.status}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-gray-300">
                      <span className="font-medium text-purple-300">Message: </span>
                      {editingOrderId === order._id ? (
                        <div className="mt-2 space-y-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Enter new message"
                            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                          />
                          <button
                            onClick={() => handleSubmitUpdateMessage(order._id)}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                          >
                            Submit Message
                          </button>
                        </div>
                      ) : (
                        <span>{order.msg || "No message"}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleUpdateMessage(order._id)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Update Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptedRetail;