import React, { useEffect, useState } from "react";
import AdminNav from "../Navbar/AdminNav";

const AdminDistributorsList = () => {
  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch distributors when the component mounts
  useEffect(() => {
    const fetchDistributors = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/users/distributors", {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        });
        const data = await response.json();
        if (response.ok) {
          setDistributors(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred while fetching distributors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  // Add a distributor to the network
  const handleAddToNetwork = async (distributor) => {
    setError(null); // Clear previous errors
    const userEmail = JSON.parse(localStorage.getItem("userdata"))?.email; // Get user email from local storage

    try {
      const response = await fetch(`http://localhost:8000/api/network/add`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ distributorEmail: distributor.email, userEmail }), // Send both emails
      });

      const data = await response.json();
      if (response.ok) {
        alert(`You have added ${distributor.name} to your network!`);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while adding to the network.");
    }
  };

  // Remove a distributor
  const handleRemoveDistributor = async (distributorId) => {
    if (window.confirm("Are you sure you want to remove this distributor?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/distributors/${distributorId}`, {
          method: "DELETE",
          credentials:"include"
        });
        if (response.ok) {
          setDistributors(distributors.filter((distributor) => distributor._id !== distributorId));
        } else {
          alert("Failed to remove the distributor.");
        }
      } catch (error) {
        alert("An error occurred while trying to remove the distributor.");
      }
    }
  };

  return (
    <>
    <AdminNav/>
    <div className="bg-gray-900 h-screen">
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold text-purple-400 mb-4">Admin - Distributors List</h1>
        {loading && <p className="text-blue-500 text-center">Loading distributors...</p>}
        {error && <div className="text-red-500 text-center"><p>{error}</p></div>}
        {distributors.length === 0 && !loading && <p className="text-white text-center">No distributors found.</p>}

        {/* Table layout for displaying distributors */}
        <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Company Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Registered At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {distributors.map((distributor) => (
              <tr key={distributor._id} className="border-t border-gray-700">
                <td className="p-4">{distributor.name}</td>
                <td className="p-4">{distributor.companyName}</td>
                <td className="p-4">{distributor.email}</td>
                <td className="p-4">{distributor.phone}</td>
                <td className="p-4">{new Date(distributor.createdAt).toLocaleDateString()}</td>
                <td className="p-4 flex space-x-2">
                  {/* <button
                    onClick={() => handleAddToNetwork(distributor)}
                    className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-200"
                    aria-label={`Add ${distributor.name} to network`}
                  >
                    Add to Network
                  </button> */}
                  <button
                    onClick={() => handleRemoveDistributor(distributor._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                    aria-label={`Remove ${distributor.name}`}
                  >
                    Remove
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

export default AdminDistributorsList;
