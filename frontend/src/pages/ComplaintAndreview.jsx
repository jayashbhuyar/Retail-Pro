import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios
import { Send, AlertCircle, Star } from 'lucide-react';
import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import AdminNav from "../components/Navbar/AdminNav";


const ComplaintAndReviewPage = () => {
  const [userData, setUserData] = useState({ name: '', email: '', role: '' });
  const [complaint, setComplaint] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const renderNavbar = () => {
    const userData = JSON.parse(localStorage.getItem("userdata"));
    const userRole = userData?.role; // Fetch the user's role from local storage
    switch (userRole) {
      case "retailer":
        return <RetailerNavbar />;
      case "distributor":
        return <DistributorsNavbar />;
      case "admin":
        return <AdminNav />;
      default:
        return null; // Return nothing if no role matches
    }
  };

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('userdata') || '{}');
    // Set default values if the stored data is empty
    setUserData({
      name: storedUserData.name || '',
      email: storedUserData.email || '',
      role: storedUserData.role || '',
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const feedbackData = {
      user: {
        name: userData.name, // Correctly reference userData
        email: userData.email,
        role: userData.role,
      },
      complaint: complaint, // Use state directly
      review: review, // Use state directly
      rating: rating, // Use state directly
    };

    // console.log("Submitting feedback data:", feedbackData);

    try {
      const response = await axios.post('http://localhost:8000/api/feedback', feedbackData,{
        withCredentials:true
      });
    //   console.log("Feedback submitted successfully:", response.data);
      // Reset the form
      setComplaint('');
      setReview('');
      setRating(0);
      setIsSubmitted(true);
      setError(''); // Clear any previous error messages
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error.response?.data || error.message);
      setError('Failed to submit feedback. Please try again.'); // Update error message
    }
  };

  const StarRating = ({ rating, setRating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer transition-all duration-150 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
 {renderNavbar()} {/* Render the appropriate navbar */}

    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 transform transition-all duration-500 ease-in-out hover:scale-100">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-8">Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {['name', 'email', 'role'].map((field) => (
              <div key={field} className="relative">
                <label htmlFor={field} className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                  {field}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  value={userData[field] || ''} // Ensure the value is always a string
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            ))}
          </div>
          <div>
            <label htmlFor="complaint" className="block text-sm font-medium text-gray-300 mb-1">Complaint</label>
            <textarea
              id="complaint"
              rows="3"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              placeholder="Please describe your complaint..."
            ></textarea>
          </div>
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-300 mb-1">Review</label>
            <textarea
              id="review"
              rows="3"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              placeholder="Please leave your review..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Submit Feedback
            <Send className="ml-2 h-5 w-5" />
          </button>
        </form>
        {isSubmitted && (
          <div className="mt-4 p-2 bg-green-800 text-green-200 rounded-md flex items-center justify-center space-x-2 animate-fade-in-out">
            <AlertCircle className="h-5 w-5" />
            <span>Feedback submitted successfully!</span>
          </div>
        )}
        {error && (
          <div className="mt-4 p-2 bg-red-800 text-red-200 rounded-md flex items-center justify-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ComplaintAndReviewPage;
