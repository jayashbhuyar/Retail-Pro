import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../Navbar/AdminNav";

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    accepted: 0,
    maxPlacedBy: { name: "", email: "", count: 0 },
    maxCompletedBy: { name: "", email: "", count: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(
          "http://localhost:8000/admin/orders",
          {
            withCredentials: true,
          }
        );
        setUsers(usersResponse.data);

        const ordersResponse = await axios.get(
          "http://localhost:8000/admin/users",
          {
            withCredentials: true,
          }
        );
        setOrders(ordersResponse.data);
        calculateOrderStats(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      }
    };

    const calculateOrderStats = (orders) => {
      const stats = {
        total: orders.length,
        completed: orders.filter((order) => order.status === "completed")
          .length,
        pending: orders.filter((order) => order.status === "pending").length,
        rejected: orders.filter((order) => order.status === "rejected").length,
        accepted: orders.filter((order) => order.status === "accepted").length,
      };

      const placedByCount = {};
      const completedByCount = {};

      orders.forEach((order) => {
        placedByCount[order.userId] = (placedByCount[order.userId] || 0) + 1;
        if (order.status === "completed") {
          completedByCount[order.userId] =
            (completedByCount[order.userId] || 0) + 1;
        }
      });

      const maxPlacedBy = getMaxUser(placedByCount);
      const maxCompletedBy = getMaxUser(completedByCount);

      setOrderStats({
        ...stats,
        maxPlacedBy,
        maxCompletedBy,
      });
    };

    const getMaxUser = (countObj) => {
      const maxUserId = Object.keys(countObj).reduce(
        (a, b) => (countObj[a] > countObj[b] ? a : b),
        null
      );
      if (maxUserId) {
        const user = users.find((user) => user._id === maxUserId);
        return user
          ? { name: user.name, email: user.email, count: countObj[maxUserId] }
          : { name: "", email: "", count: 0 };
      }
      return { name: "", email: "", count: 0 };
    };

    fetchData();
  }, []);

  const OrderTable = ({ orders, title, color }) => (
    <div
      className={`mb-8 bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${color}`}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="py-2 px-4">Retailer</th>
              <th className="py-2 px-4">Distributor</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Delivery Before</th>
              <th className="py-2 px-4">Message</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-700">
                <td className="py-2 px-4">
                  {order.userName} ({order.userEmail})
                </td>
                <td className="py-2 px-4">
                  {order.distributorName} ({order.distributorEmail})
                </td>
                <td className="py-2 px-4">{order.productName}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.price}</td>
                <td className="py-2 px-4">
                  {new Date(order.deliveryBefore).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">{order.msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <AdminNav />
      <div className="flex h-screen bg-gray-900 text-gray-200">
        <nav className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">
            Admin Dashboard
          </h2>
          <ul className="space-y-2">
            <li className="hover:bg-gray-700 p-2 rounded transition duration-300">
              <a href="#users" className="text-teal-300 hover:text-teal-100">
                Users
              </a>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded transition duration-300">
              <a href="#orders" className="text-pink-300 hover:text-pink-100">
                Orders
              </a>
            </li>
            <li className="hover:bg-gray-700 p-2 rounded transition duration-300">
              <a
                href="#settings"
                className="text-yellow-300 hover:text-yellow-100"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-00">
          <h1 className="text-4xl font-bold mb-5 text-center text-orange-400 shadow-text">
            Shri Swami Samartha
          </h1>
          <h1 className="text-4xl font-bold mb-5 text-center text-orange-600 shadow-text">
            Admin Dashboard
          </h1>
          {error && (
            <p className="text-red-500 bg-red-900 p-4 rounded-lg mb-4">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Users",
                value: users.length,
                color: "bg-green-500",
              },
              {
                label: "Total Orders",
                value: orderStats.total,
                color: "bg-blue-500",
              },
              {
                label: "Completed Orders",
                value: orderStats.completed,
                color: "bg-purple-500",
              },
              {
                label: "Pending Orders",
                value: orderStats.pending,
                color: "bg-yellow-500",
              },
              {
                label: "Accepted Orders",
                value: orderStats.accepted,
                color: "bg-indigo-500",
              },
              {
                label: "Rejected Orders",
                value: orderStats.rejected,
                color: "bg-red-500",
              },
              {
                label: "Max Orders Placed",
                value: `${orderStats.maxPlacedBy.name}`,
                extra: `${orderStats.maxPlacedBy.count} orders`,
                color: "bg-pink-500",
              },
              {
                label: "Max Orders Completed",
                value: `${orderStats.maxCompletedBy.name}`,
                extra: `${orderStats.maxCompletedBy.count} orders`,
                color: "bg-teal-500",
              },
            ].map(({ label, value, extra, color }, index) => (
              <div
                key={index}
                className={`${color} p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300`}
              >
                <h3 className="text-xl font-semibold text-gray-100">{label}</h3>
                <p className="text-3xl font-bold mt-2 text-white">{value}</p>
                {extra && <p className="text-sm mt-1 text-gray-200">{extra}</p>}
              </div>
            ))}
          </div>

          <div
            id="users"
            className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-teal-400"
          >
            <h2 className="text-2xl font-bold mb-4 text-teal-300">Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-lg">
                <thead>
                  <tr className="bg-gray-700 text-gray-200">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Phone</th>
                    <th className="py-2 px-4">Role</th>
                    <th className="py-2 px-4">Shop Name</th>
                    <th className="py-2 px-4">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-700 transition duration-150"
                    >
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.phone}</td>
                      <td className="py-2 px-4">{user.role}</td>
                      <td className="py-2 px-4">{user.shopName || "N/A"}</td>
                      <td className="py-2 px-4">{user.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div id="orders">
            <OrderTable
              orders={orders.filter((order) => order.status === "pending")}
              title="Pending Orders"
              color="border-yellow-400"
            />
            <OrderTable
              orders={orders.filter((order) => order.status === "accepted")}
              title="Accepted Orders"
              color="border-green-400"
            />
            <OrderTable
              orders={orders.filter((order) => order.status === "completed")}
              title="Completed Orders"
              color="border-blue-400"
            />
            <OrderTable
              orders={orders.filter((order) => order.status === "rejected")}
              title="Rejected Orders"
              color="border-red-400"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;