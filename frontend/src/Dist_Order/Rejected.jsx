import React, { useEffect, useState } from "react";
import axios from "axios";
import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";

const Rejected = () => {
  const [rejectedOrders, setRejectedOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRejectedOrders = async () => {
      const userData = JSON.parse(localStorage.getItem("userdata"));
      const distributorEmail = userData?.email;

      if (!distributorEmail) {
        setError("Distributor email is not set in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/orders/rejected?distributorEmail=${distributorEmail}`,{
            withCredentials:true
          }
        );

        if (response.data && response.data.length > 0) {
          setRejectedOrders(response.data);
        } else {
          setError("No rejected orders found.");
        }
      } catch (error) {
        console.error("Error fetching rejected orders:", error);
        setError("Failed to fetch rejected orders. Please try again later.");
      }
    };

    fetchRejectedOrders();
  }, []);

  // Function to handle the deletion of an order
  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8000/api/orders/status/${orderId}`,{
        withCredentials:true
      });
      // Remove the deleted order from the state
      setRejectedOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order. Please try again later.");
    }
  };

  return (
    <>
    <DistributorsNavbar/>
    <div className="bg-black min-h-screen"> {/* Set background to black */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center text-purple-400 my-8">Rejected Orders</h1>
        {error ? (
          <div className="text-red-500 text-center mt-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
              >
                <h2 className="text-lg font-semibold text-teal-300 mt-2">
                  {order.productName}
                </h2>
                <p className="text-gray-400">Ordered by: {order.userName}</p>
                <p className="text-gray-400">Email: {order.userEmail}</p>
                <p className="text-gray-400">Phone: {order.userPhone}</p>
                <p className="text-gray-400">Shop Name: {order.shopName}</p>
                <p className="font-bold text-xl mt-2 text-white">Price: ₹ {order.price}</p>
                <p className="text-gray-500">Quantity: {order.quantity}</p>
                <p className="text-gray-500">Address: {order.retailerAddress}</p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Rejected;