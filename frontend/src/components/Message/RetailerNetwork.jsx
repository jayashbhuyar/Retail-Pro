import React, { useEffect, useState } from "react";
import RetailerNavbar from "../Navbar/RetailerNavbar";
import { useNavigate } from "react-router-dom";
import { Info, Package, X, Phone, Mail, Building, MapPin, Calendar } from "lucide-react";

const RetailerNetwork = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userEmail = JSON.parse(localStorage.getItem("userdata"))?.email;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      if (!userEmail) {
        setError("User email not found. Please log in.");
        return;
      }
      console.log("Fetching accepted requests for email:", userEmail);
      try {
        const response = await fetch(
          ` http://localhost:8000/api/network/all/accepted/retailer?email=${userEmail}`,
          {
            method: "GET", // Specify the request method if needed (GET is default)
            credentials: "include", // Include credentials with the request
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAcceptedRequests(data);
        } else {
          setError(data.error || "Failed to fetch accepted requests.");
        }
      } catch (error) {
        setError("An error occurred while fetching accepted requests.");
      }
    };

    fetchAcceptedRequests();
  }, [userEmail]);

  const handleMoreInfo = async (request) => {
    try {
      const response = await fetch(
        ` http://localhost:8000/api/users/data/${request.distributorEmail}`,
        {
          method: "GET", // Specify the request method if needed (GET is default)
          credentials: "include", // Include credentials with the request
        }
      );
      const distributorData = await response.json();
      if (response.ok) {
        setSelectedDistributor(distributorData);
        setIsModalOpen(true);
      } else {
        setError("Failed to fetch distributor details.");
      }
    } catch (error) {
      setError("An error occurred while fetching distributor details.");
    }
  };

  const handleAllProducts = (distributorEmail) => {
    navigate(`/distributor-products/${distributorEmail}`);
  };

  return (
    <>
      <RetailerNavbar />
      <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
        <h2 className="text-4xl font-bold mb-8 text-gray-100 text-center">My Network</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        {acceptedRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {acceptedRequests.map((request) => (
              <div
                key={request._id}
                className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-lg p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {request.distributorName}
                  </h3>
                  <p className="text-gray-300 mb-1">Email: {request.distributorEmail}</p>
                  <p className="text-gray-300 mb-1">Status: {request.status}</p>
                  <h4 className="text-lg font-semibold mt-4 text-white mb-2">
                    Retailer Info
                  </h4>
                  <p className="text-gray-300 mb-1">User Name: {request.userName}</p>
                  <p className="text-gray-300 mb-1">User Email: {request.userEmail}</p>
                  <p className="text-gray-300 mb-1">
                    Created At: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => handleMoreInfo(request)}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
                  >
                    <Info className="mr-2" size={20} />
                    More Info
                  </button>
                  <button
                    onClick={() => handleAllProducts(request.distributorEmail)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
                  >
                    <Package className="mr-2" size={20} />
                    All Products
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center text-xl">No accepted network requests found.</p>
        )}

{isModalOpen && selectedDistributor && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">
    <div className="bg-white rounded-lg overflow-hidden shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-100 hover:scale-105">
      {/* Top section for the image */}
      <div className="relative">
        <img
          src={selectedDistributor.image}
          alt={selectedDistributor.name}
          className="w-44 h-56 object-cover rounded-t-lg" // Adjust the height for a smaller image
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Bottom section for distributor info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {selectedDistributor.name}
        </h3>

        {/* Distributor info displayed in a neat and creative way */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="flex items-center">
            <Mail className="text-blue-500 mr-3" size={20} />
            <p className="text-gray-600">{selectedDistributor.email}</p>
          </div>
          <div className="flex items-center">
            <Phone className="text-green-500 mr-3" size={20} />
            <p className="text-gray-600">{selectedDistributor.phone}</p>
          </div>
          <div className="flex items-center">
            <Building className="text-purple-500 mr-3" size={20} />
            <p className="text-gray-600">{selectedDistributor.companyName}</p>
          </div>
          <div className="flex items-center">
            <MapPin className="text-red-500 mr-3" size={20} />
            <p className="text-gray-600">{selectedDistributor.address}</p>
          </div>
          <div className="flex items-center col-span-full">
            <Calendar className="text-yellow-500 mr-3" size={20} />
            <p className="text-gray-600">
              Registered on: {new Date(selectedDistributor.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Button to close the modal */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default RetailerNetwork;