import React, { useEffect, useState } from "react";
import {
  Star,
  Loader2,
  MessageCircle,
  UserCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AdminNav from "../Navbar/AdminNav";

const AdminComplaints = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/feedback", {
        method: "GET", // Specify the request method if needed (GET is default)
        credentials: "include", // Include credentials with the request
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      setFeedback(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("Error fetching feedback. Please try again later.");
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`inline-block w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-600"
          }`}
        />
      ));
  };

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <>
    <AdminNav/>
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-300 mb-8 text-center underline">
          User Feedback Dashboard
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-red-400 text-xl">{error}</p>
        ) : feedback.length === 0 ? (
          <p className="text-center text-gray-400 text-xl">
            No feedback found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedback.map((item) => (
              <div
                key={item._id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-100 hover:shadow-2xl"
              >
                <div className="bg-indigo-600 text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserCircle className="w-6 h-6" />
                      <span className="font-semibold">{item.user.name}</span>
                    </div>
                    <span className="text-sm bg-green-600 rounded-full px-3 py-1">
                      {item.user.role}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-gray-400 mb-4">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-red-500 mb-2">
                      Complaint
                    </h3>
                    <p className="text-gray-300">
                      {expandedCard === item._id
                        ? item.complaint
                        : `${item.complaint.slice(0, 100)}${
                            item.complaint.length > 100 ? "..." : ""
                          }`}
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-green-500 mb-2">
                      Review
                    </h3>
                    <p className="text-gray-300">
                      {expandedCard === item._id
                        ? item.review
                        : `${item.review.slice(0, 100)}${
                            item.review.length > 100 ? "..." : ""
                          }`}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                    </div>
                    <button
                      onClick={() => toggleExpand(item._id)}
                      className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                    >
                      <span>{expandedCard === item._id ? "Less" : "More"}</span>
                      {expandedCard === item._id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminComplaints;