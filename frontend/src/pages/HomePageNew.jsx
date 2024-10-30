import React from "react";
import { Link } from "react-router-dom";
import DistributorsNavbar from "../components/Navbar/DistributorsNavbar";
import RetailerNavbar from "../components/Navbar/RetailerNavbar";
import AdminNav from "../components/Navbar/AdminNav";

const HomePageNew = () => {
  const userData = JSON.parse(localStorage.getItem("userdata"));
  const userRole = userData?.role;

  const renderNavbar = () => {
    switch (userRole) {
      case "admin":
        return <AdminNav />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderNavbar()}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white min-h-screen flex flex-col">
        <header className="bg-black bg-opacity-30 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center shadow-lg">
          <div className="flex items-center mb-4 sm:mb-0">
            <img
              src="https://www.myretailconnect.com/assets/img/Retail-Connect-Logo.png"
              alt="Retail Connect Logo"
              className="h-12 sm:h-16 w-auto mr-4 rounded-full shadow-md"
            />
            <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              RetailConnect
            </h1>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-semibold mb-4 sm:mb-6 animate-pulse">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              RetailConnect!
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl">
            Connecting retailers and distributors seamlessly. Manage your orders,
            products, and analytics effortlessly!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl">
            {[
              {
                title: "Efficient Order Management",
                description: "Track and manage your orders seamlessly with our intuitive interface.",
                image: "https://www.pfscommerce.com/wp-content/uploads/2020/05/RetailConnect-Store-Edition-FULL.gif",
              },
              {  
                title: "Retail Management",
                description: "Empowering Retailers and Distributors for Seamless Collaboration",
                image: "https://mbaweb.weebly.com/uploads/1/7/6/7/17678417/mba-retail-management_orig.png",
              },
              {
                title: "Analytics & Insights",
                description: "Get detailed insights to boost your sales and make informed decisions.",
                image: "https://cdn.dribbble.com/users/980520/screenshots/2859415/monitoring.gif",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 p-4 sm:p-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-opacity-20 backdrop-filter backdrop-blur-sm flex flex-col items-center"
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-32 sm:h-40 w-auto mb-3 sm:mb-4 rounded-md object-cover"
                />
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-pink-300">
                  {feature.title}
                </h3>
                <p className="text-center text-purple-100 text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </main>

        <footer className="bg-black bg-opacity-30 p-4 sm:p-6 text-center shadow-lg">
          <p className="text-xs sm:text-sm text-purple-200">
            © 2024 RetailConnect. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default HomePageNew;