import React, { useEffect, useState } from "react";
import DistributorsNavbar from "../Navbar/DistributorsNavbar"

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const userEmail = JSON.parse(localStorage.getItem("userdata"))?.email; // Get user email from local storage

  useEffect(() => {
    const fetchRequests = async () => {
      console.log("Fetching requests for email:", userEmail); // Log the email being used
      try {
        const response = await fetch(
          `http://localhost:8000/api/network/pending?email=${userEmail}`, {
            method: "GET", // Specify the request method if needed (GET is default)
            credentials: "include", // Include credentials with the request
          } // Fetch pending requests
        );
        const data = await response.json();
        if (response.ok) {
          setRequests(data); // Set the requests state with the fetched data
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred while fetching requests.");
      }
    };

    fetchRequests();
  }, [userEmail]);

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/network/status/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "accepted" }), 
          credentials: "include", // Include credentials with the request
         
        }
      );

      const data = await response.json();
      if (response.ok) {
        setRequests(requests.filter((request) => request._id !== requestId)); // Remove accepted request from state
        alert(data.message); // Notify user of success
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while accepting the request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/network/status/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected" }), 
          credentials: "include", // Include credentials with the request
         // Update status to rejected
        }
      );

      const data = await response.json();
      if (response.ok) {
        setRequests(requests.filter((request) => request._id !== requestId)); // Remove rejected request from state
        alert(data.message); // Notify user of success
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while rejecting the request.");
    }
  };

  return (
    <>
    <DistributorsNavbar/>
  
    <div className="min-h-screen bg-gray-900 p-4"> {/* Dark background */}
      <h2 className="text-3xl font-bold text-purple-400 mb-4 text-center">Network Requests</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 gap-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="bg-gray-800 shadow-md rounded-lg p-4 flex flex-col transition-transform transform hover:scale-100"
          >
            <h3 className="text-lg font-bold text-teal-300">{request.userName}</h3>
            <p className="text-gray-400">Email: {request.userEmail}</p>
            <p className="text-gray-400">Status: {request.status}</p>
            <div className="mt-auto flex space-x-2">
              <button
                onClick={() => handleAccept(request._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Requests;