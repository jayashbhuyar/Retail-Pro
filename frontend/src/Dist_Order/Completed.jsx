import React, { useEffect, useState } from "react";
import axios from "axios";
import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";
import { User, Mail, Phone, AlertCircle } from "lucide-react";

const Completed = () => {
  const [completedOrders, setCompletedOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(""); // Track selected month
  const [selectedYear, setSelectedYear] = useState(""); // Track selected year
  const [sortOption, setSortOption] = useState("latest"); // Default sort to latest

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      const userData = JSON.parse(localStorage.getItem("userdata"));
      const distributorEmail = userData.email;

      if (!distributorEmail) {
        setError("Distributor email not found in local storage.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/orders/completed`,
          {
            params: { distributorEmail },
            withCredentials: true,
          }
        );
        setCompletedOrders(response.data);
        setDisplayedOrders(response.data); // Initialize display
      } catch (error) {
        console.error("Error fetching completed orders:", error);
        setError("Failed to fetch completed orders.");
      }
    };

    fetchCompletedOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [sortOption, selectedMonth, selectedYear, completedOrders]);

  const filterAndSortOrders = () => {
    let filteredOrders = [...completedOrders];
    const currentDate = new Date();

    // Filter by selected month and year
    if (selectedMonth && selectedYear) {
      const monthIndex = parseInt(selectedMonth) - 1; // Convert month to zero-based index
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.completedOn);
        return (
          orderDate.getMonth() === monthIndex &&
          orderDate.getFullYear() === parseInt(selectedYear)
        );
      });
    }

    // Sort or filter by time options
    if (sortOption === "latest") {
      filteredOrders.sort((a, b) => new Date(b.completedOn) - new Date(a.completedOn));
    } else if (sortOption === "oldest") {
      filteredOrders.sort((a, b) => new Date(a.completedOn) - new Date(b.completedOn));
    } else if (sortOption === "last15days") {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.completedOn);
        const daysDiff = (currentDate - orderDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 15;
      });
    }

    setDisplayedOrders(filteredOrders);
  };

  const monthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {new Date(0, i).toLocaleString("en-US", { month: "long" })}
      </option>
    ));
  };

  const yearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, i) => (
      <option key={currentYear - i} value={currentYear - i}>
        {currentYear - i}
      </option>
    ));
  };

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-red-900 text-red-100 p-4 rounded-lg flex items-center">
          <AlertCircle className="mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DistributorsNavbar />
      <div className="bg-gradient-to-br from-gray-900 to-indigo-900 min-h-screen p-4">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Completed Orders
        </h1>

        {/* Sorting and Filtering Dropdowns */}
        <div className="flex flex-col sm:flex-row justify-center mb-4 gap-4">
          {/* Month Filter */}
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setSelectedYear(""); // Reset year when month changes
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="">Select Month</option>
            {monthOptions()}
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="">Select Year</option>
            {yearOptions()}
          </select>

          {/* Sort Order */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="last15days">Last 15 Days</option>
          </select>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-lg">
            <thead>
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Delivery Before</th>
                <th className="p-3 text-left">Completed On</th>
                <th className="p-3 text-left">Message</th>
                {/* <th className="p-3 text-left">Cancel Reason</th> */}
                <th className="p-3 text-left">Address</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-700">
                  <td className="p-3">{order.productName}</td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <User className="text-blue-400" />
                      <span>{order.userName}</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      <Mail className="inline text-green-400 mr-1" />
                      {order.userEmail}
                    </div>
                    <div className="text-gray-400 text-sm">
                      <Phone className="inline text-yellow-400 mr-1" />
                      {order.userPhone}
                    </div>
                  </td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="p-3">₹ {order.price}</td>
                  <td className="p-3">
                    {new Date(order.deliveryBefore).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short", year: "numeric" }
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(order.completedOn).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3">
                    <MessageWithToggle message={order.msg} />
                  </td>
                  {/* <td className="p-3">{order.orderCancelReason || "N/A"}</td> */}
                  <td className="p-3">{order.retailerAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Message with "Read More" toggle functionality
const MessageWithToggle = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 50; // Maximum characters before truncation

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  return (
    <div>
      {message.length > MAX_LENGTH && !isExpanded
        ? `${message.substring(0, MAX_LENGTH)}... `
        : message}
      {message.length > MAX_LENGTH && (
        <button
          onClick={toggleExpansion}
          className="text-blue-400 text-sm underline"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default Completed;
