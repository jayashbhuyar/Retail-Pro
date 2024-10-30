// About.jsx

import React from "react";
// import RetailersNavbar from "../components/Navbar/RetailersNavbar"; // Import RetailersNavbar
// import AdminNavbar from "../components/Navbar/AdminNavbar"; // Import AdminNavbar
import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import AdminNav from "../components/Navbar/AdminNav";

const About = () => {
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const userRole = userData?.role; // Fetch the user's role from local storage

  // Determine which navbar to render based on user role
  const renderNavbar = () => {
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

  return (
    <>
      {renderNavbar()} {/* Render the appropriate navbar */}

      <div className="bg-gray-900 text-white">
        <div className="container mx-auto p-6">
          {/* Logo Section */}
          <div className="text-center mb-6">
            <img
              src="https://www.myretailconnect.com/assets/img/Retail-Connect-Logo.png"
              alt="RetailConnect Logo"
              className="w-1/3 mx-auto rounded-lg shadow-lg border-4 border-gray-700"
            />
          </div>

          <h1 className="text-4xl font-bold text-center my-8">
            About RetailConnect
          </h1>

          <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            <div className="md:w-1/2 mb-4">
              <h2 className="text-3xl font-semibold mb-2">
                Connecting Retailers and Distributors
              </h2>
              <p className="text-lg">
                RetailConnect is a pioneering platform designed to bridge the
                gap between retailers and distributors. We leverage cutting-edge
                technology to streamline order management, inventory tracking,
                and communication, ensuring a seamless experience for all users.
              </p>
            </div>
            <div className="md:w-1/2 mb-4">
              <img
                src="https://www.pfscommerce.com/wp-content/uploads/2020/05/RetailConnect-Store-Edition-FULL.gif"
                className="w-full h-auto rounded-lg shadow-lg border-4 border-gray-700"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
            <div className="md:w-1/2 mb-4">
              <h2 className="text-3xl font-semibold mb-2">Our Mission</h2>
              <p className="text-lg">
                Our mission is to revolutionize the retail landscape by
                empowering businesses with the tools they need to succeed. We
                are committed to fostering collaboration and innovation in the
                supply chain, enabling our users to thrive in an ever-evolving
                marketplace.
              </p>
            </div>
            <div className="md:w-1/2 mb-4">
              <img
                src="https://i.pinimg.com/originals/96/2f/f6/962ff6c2e535eebc9d762cf420b631c8.gif"
                alt="RetailConnect Logo"
                className="w-full h-auto rounded-lg shadow-lg border-4 border-gray-700"
              />
            </div>
          </div>

          <h2 className="text-4xl font-semibold text-center my-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h3 className="font-bold text-xl mb-2">User Authentication</h3>
              <p>
                Secure login and account management for both retailers and
                distributors.
              </p>
            </div>
            <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h3 className="font-bold text-xl mb-2">
                Product Catalog Management
              </h3>
              <p>
                Easily manage and showcase products with detailed descriptions
                and images.
              </p>
            </div>
            <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h3 className="font-bold text-xl mb-2">Order Management</h3>
              <p>
                Streamlined order processing with real-time updates on order
                status.
              </p>
            </div>
            <div className="bg-gray-800 text-gray-200 border border-gray-700 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <h3 className="font-bold text-xl mb-2">Analytics & Insights</h3>
              <p>
                Gain valuable insights into sales trends and inventory
                performance.
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-semibold text-center my-6">
            How We Are Connected
          </h2>
          <div className="flex justify-center mb-4">
            <img
              src="https://routemobile.b-cdn.net/wp-content/uploads/2021/10/Social-Media_Banner_How-Connected-Technology-is-Shaping-the-Retail-Industry.png"
              alt="How Connected Technology is Shaping Retail"
              className="w-full md:w-2/3 h-auto rounded-lg shadow-lg border-4 border-gray-700"
            />
          </div>

          <h2 className="text-4xl font-semibold text-center my-6">
            Join Our Community!
          </h2>
          <div className="flex justify-center mb-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIVGAauZX0JEVwEKOU9J3EnAjWir_ztq493P8NSkolgLWkJQjg7xUooQpOV3XlHAWQYbI&usqp=CAU"
              alt="RetailConnect Community"
              className="w-full md:w-2/3 h-auto rounded-lg shadow-lg border-4 border-gray-700"
            />
          </div>

          <div className="text-center mt-6">
            <p className="text-lg">
              We invite you to explore the endless possibilities of
              RetailConnect and become part of a thriving community. Together,
              we can transform the retail landscape!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
