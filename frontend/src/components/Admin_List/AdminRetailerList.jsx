import React, { useEffect, useState } from "react";
// import DistributorsNavbar from "../Navbar/DistributorsNavbar";
import AdminNav from "../Navbar/AdminNav";

const AdminRetailerList = () => {
  const [retailers, setRetailers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/users/retailers", {
            method: "GET", // Specify the request method if needed (GET is default)
            credentials: "include", // Include credentials with the request
          }
        );
        const data = await response.json();
        if (response.ok) {
          setRetailers(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred while fetching retailers.");
      } finally {
        setLoading(false);
      }
    };

    fetchRetailers();
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchRetailers();
  };

  const handleDeleteRetailer = async (retailerId) => {
    if (window.confirm("Are you sure you want to delete this retailer?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/users/retailers/${retailerId}`,
          { method: "DELETE" ,
            credentials:"include"
          }
        );
        if (response.ok) {
          // Remove the retailer from the state after successful deletion
          setRetailers(retailers.filter((retailer) => retailer._id !== retailerId));
        } else {
          alert("Failed to delete the retailer.");
        }
      } catch (error) {
        alert("An error occurred while trying to delete the retailer.");
      }
    }
  };

  return (
    <>
   <AdminNav/>
    <div className="bg-gray-900 h-screen">
      {/* <DistributorsNavbar /> */}
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold text-purple-400 mb-4">Retailer List</h1>
        {loading && (
          <p className="text-blue-500 text-center">Loading retailers...</p>
        )}
        {error && (
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button onClick={handleRetry} className="text-blue-500 underline">
              Retry
            </button>
          </div>
        )}

        {/* Table layout for displaying retailers */}
        <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Registered At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {retailers.map((retailer) => (
              <tr key={retailer._id} className="border-t border-gray-700">
                <td className="p-4">{retailer.name}</td>
                <td className="p-4">{retailer.email}</td>
                <td className="p-4">{new Date(retailer.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDeleteRetailer(retailer._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default AdminRetailerList;
