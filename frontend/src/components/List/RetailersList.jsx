import React, { useEffect, useState } from "react";
import DistributorsNavbar from "../Navbar/DistributorsNavbar";

const RetailerCard = ({ retailer, onMoreInfoClick, onContactDetailsClick }) => {
  const defaultImage = "path/to/default/image.jpg";

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-4 mb-4 flex items-center justify-between transition-all hover:bg-gray-700">
      <div className="flex items-center space-x-4">
        <img
          src={retailer.image || defaultImage}
          alt={retailer.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-bold text-purple-400">{retailer.name}</h3>
          <p className="text-gray-300">Shop Name: {retailer.shopName}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onMoreInfoClick(retailer)}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition duration-200"
        >
          More Info
        </button>
        <button
          onClick={() => onContactDetailsClick(retailer)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Contact Details
        </button>
      </div>
    </div>
  );
};

const RetailersList = () => {
  const [retailers, setRetailers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [showContactDetails, setShowContactDetails] = useState(false);

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

  const handleMoreInfoClick = (retailer) => {
    setSelectedRetailer(retailer);
  };

  const handleContactDetailsClick = (retailer) => {
    setSelectedRetailer(retailer);
    setShowContactDetails(true);
  };

  const handleCloseModal = () => {
    setSelectedRetailer(null);
    setShowContactDetails(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <DistributorsNavbar />
      <div className="container mx-auto p-4 pt-6">
        <div className="max-w-4xl mx-auto">
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
          {retailers.map((retailer) => (
            <RetailerCard
              key={retailer._id}
              retailer={retailer}
              onMoreInfoClick={handleMoreInfoClick}
              onContactDetailsClick={handleContactDetailsClick}
            />
          ))}
        </div>
      </div>

      {/* Modal for displaying retailer information */}
      {selectedRetailer && !showContactDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Retailer Info</h2>
            <p className="text-gray-300">ID: {selectedRetailer._id}</p>
            <p className="text-gray-300">Name: {selectedRetailer.name}</p>
            <p className="text-gray-300">Role: {selectedRetailer.role}</p>
            <p className="text-gray-300">Shop Name: {selectedRetailer.shopName}</p>
            <p className="text-gray-300">Registered On: {new Date(selectedRetailer.createdAt).toLocaleDateString()}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for displaying contact details */}
      {selectedRetailer && showContactDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Contact Details</h2>
            <p className="text-gray-300">Email: {selectedRetailer.email}</p>
            <p className="text-gray-300">Phone: {selectedRetailer.phone}</p>
            <p className="text-gray-300">Address: {selectedRetailer.address}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCloseModal}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailersList;