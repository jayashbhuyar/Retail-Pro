import React, { useEffect, useState } from "react";
import axios from "axios";
import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";
import {
  Package,
  Mail,
  Phone,
  Store,
  Calendar,
  DollarSign,
  MessageCircle,
  MapPin,
  CheckCircle,
  IndianRupeeIcon,
} from "lucide-react";

const Accepted = () => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      const userData = JSON.parse(localStorage.getItem("userdata"));
      const distributorEmail = userData?.email;

      if (!distributorEmail) {
        setError("Distributor email not found in local storage.");
        return;
      }

     try {
  const response = await axios.get(
    `http://localhost:8000/api/orders/accepted`,
    {
      params: {
        distributorEmail,
      },
      withCredentials: true, // Include credentials (cookies) with the request
    }
  );

  setAcceptedOrders(response.data);
  if (!(response.data && response.data.length > 0)) {
    setError("No Accepted Orders found.");
  }
} catch (error) {
        console.error("Error fetching accepted orders:", error);
        setError("Failed to fetch accepted orders.");
      }
    };

    fetchAcceptedOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/orders/${orderId}/status`, // URL
        { 
          status: "completed",
          completedOn: new Date().toISOString(), // Sending the current date as completion date
        },
        {
          withCredentials: true, // Include credentials (cookies) with the request
        }
      );
    
      const updatedOrder = response.data;
  
      setAcceptedOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status.");
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <>
      <DistributorsNavbar />
      <div className="bg-gray-900 min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Accepted Orders
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {acceptedOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-500 flex flex-col"
            >
              <div className="relative h-40">
                <img
                  src={order.img}
                  alt={order.productName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 m-2 rounded-full text-xs font-semibold">
                  {order.status}
                </div>
              </div>
              <div className="p-3 flex-grow">
                <h2 className="text-lg font-bold text-white mb-2 truncate">
                  {order.userName}
                </h2>
                <div className="space-y-1 text-xs text-gray-300">
                  <p className="flex items-center">
                    <Mail className="w-3 h-3 mr-1" />{" "}
                    <span className="truncate">{order.userEmail}</span>
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-3 h-3 mr-1" /> {order.userPhone}
                  </p>
                  <p className="flex items-center">
                    <Store className="w-3 h-3 mr-1" />{" "}
                    <span className="truncate">{order.shopName}</span>
                  </p>
                  <p className="flex items-center">
                    <Package className="w-3 h-3 mr-1" /> Qty: {order.quantity}
                  </p>
                  <p className="flex items-center">
                    <IndianRupeeIcon className="w-3 h-3 mr-1" />Rs. {order.price}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />{" "}
                    {formatDate(order.deliveryBefore) || "N/A"}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />{" "}
                    <span className="truncate">{order.retailerAddress}</span>
                  </p>
                  <div className="flex items-start">
                    <MessageCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                    <p className="flex-grow line-clamp-2 hover:line-clamp-none">
                      {order.msg}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-white font-semibold text-sm truncate">
                  {order.productName}
                </p>
              </div>
              <button
                onClick={() => handleCompleteOrder(order._id)}
                className="w-full bg-green-600 text-white py-2 px-4 text-sm hover:bg-green-500 transition-colors duration-300 flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Accepted;