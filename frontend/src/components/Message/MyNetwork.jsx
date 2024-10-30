import React, { useEffect, useState } from "react";
import DistributorsNavbar from "../Navbar/DistributorsNavbar";
import { 
  Trash2, 
  Mail, 
  User, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Building,
  Network
} from "lucide-react";

const MyNetwork = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [error, setError] = useState(null);
  const userEmail = JSON.parse(localStorage.getItem("userdata"))?.email;

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      if (!userEmail) {
        setError("User email not found. Please log in.");
        return;
      }
      console.log("Fetching accepted requests for email:", userEmail);
      try {
        const response = await fetch(
          `http://localhost:8000/api/network/accepted?email=${userEmail}`, {
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

  const handleReject = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/network/reject/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected" }),
          credentials: "include", // Include credentials with the request
        
        }
      );

      const data = await response.json();
      if (response.ok) {
        setAcceptedRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== id)
        );
        alert(data.message || "Request rejected successfully.");
      } else {
        setError(data.error || "Failed to reject the request.");
      }
    } catch (error) {
      setError("An error occurred while rejecting the request.");
    }
  };

  return (
    <>
      <DistributorsNavbar />
      <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Network className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Network
            </h2>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {acceptedRequests.length > 0 ? (
            <div className="space-y-4">
              {acceptedRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-5 h-5 text-blue-500" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {request.distributorName}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Remove from network"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Your Email:</span>{" "}
                            {request.distributorEmail}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="font-medium">Status:</span>{" "}
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {request.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Retailer Name:</span>{" "}
                            {request.userName}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Retailer Email:</span>{" "}
                            {request.userEmail}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Connected Since:</span>{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 flex flex-col items-center gap-2">
              <Network className="w-12 h-12 text-gray-400" />
              No accepted network requests found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyNetwork;