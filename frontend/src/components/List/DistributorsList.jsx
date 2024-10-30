import React, { useEffect, useState } from "react";
import RetailerNavbar from "../Navbar/RetailerNavbar";
import { MessageCircle, UserPlus, AlertCircle, X } from 'lucide-react';

const DistributorsList = () => {
  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchDistributors = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:8000/api/users/distributors", {
            method: "GET", // Specify the request method if needed (GET is default)
            credentials: "include", // Include credentials with the request
          }
        );
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

  const handleAddToNetwork = async (distributor) => {
    setError(null);
    const userEmail = JSON.parse(localStorage.getItem("userdata"))?.email;
  
    try {
      const response = await fetch(`http://localhost:8000/api/network/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ distributorEmail: distributor.email, userEmail }),
        credentials: "include", // Include credentials with the request
        
      });
  
      const data = await response.json();
      if (response.ok) {
        showNotification(`${distributor.name} added to your network!`, "success");
      } else {
        showNotification(data.error, "error");
      }
    } catch (error) {
      showNotification("An error occurred while adding to the network.", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <RetailerNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-purple-400 mb-8">Distributors Network</h1>
        
        {notification && (
          <div className={`fixed top-4 right-4 max-w-sm w-full ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white rounded-lg shadow-lg overflow-hidden`}>
            <div className="p-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3" />
              <p>{notification.message}</p>
              <button onClick={() => setNotification(null)} className="ml-auto">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && <p className="text-center col-span-full">Loading distributors...</p>}
          {error && <p className="text-red-500 text-center col-span-full">{error}</p>}
          {distributors.length === 0 && !loading && <p className="text-center col-span-full">No distributors found.</p>}
          {distributors.map((distributor) => (
            <div
              key={distributor._id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className="h-72 overflow-hidden">
                <img
                  src={distributor.image}
                  alt={distributor.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-teal-300 mb-2">{distributor.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{distributor.companyName}</p>
                <p className="text-gray-400 text-sm mb-1">{distributor.email}</p>
                <p className="text-gray-400 text-sm mb-1">{distributor.phone}</p>
                <p className="text-gray-400 text-sm mb-4">Joined: {new Date(distributor.createdAt).toLocaleDateString()}</p>
                <div className="flex space-x-2">
                  <button
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                    aria-label={`Message ${distributor.name}`}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message
                  </button>
                  <button
                    onClick={() => handleAddToNetwork(distributor)}
                    className="flex-1 bg-teal-500 text-white px-3 py-2 rounded-full hover:bg-teal-600 transition duration-300 flex items-center justify-center"
                    aria-label={`Add ${distributor.name} to network`}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DistributorsList;