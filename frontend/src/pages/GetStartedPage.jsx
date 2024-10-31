import React from 'react';
import{Link} from "react-router-dom"

const GetStartedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 to-teal-800 text-white">
      <div className="max-w-4xl mx-auto text-center p-6">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6">
          Get Started with RetailPro
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Join our platform to connect with retailers and distributors, streamline your operations, and grow your business like never before!
        </p>

        <div className="flex justify-center mb-8">
          <img
            src="https://www.pfscommerce.com/wp-content/uploads/2020/05/RetailConnect-Store-Edition-FULL.gif"
            alt="Get Started"
            className="rounded-lg shadow-lg w-80 sm:w-96"
          />
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
          Why Choose Us?
        </h2>
        <ul className="list-disc list-inside mb-8">
          <li className="text-lg">🚀 Fast and Easy Setup</li>
          <li className="text-lg">📊 Comprehensive Dashboard</li>
          <li className="text-lg">💬 24/7 Customer Support</li>
          <li className="text-lg">🔒 Secure Transactions</li>
        </ul>
    <Link to="/auth/signup">
        <button className="bg-yellow-500 text-black font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300">
          Sign Up Now
        </button></Link>
      </div>

      <footer className="mt-10">
        <p className="text-sm text-gray-200">
          &copy; 2024 RetailPro. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default GetStartedPage;
