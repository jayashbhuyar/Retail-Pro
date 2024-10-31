import Cookies from 'js-cookie';
import { useState, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe } from 'lucide-react';

const DistributorsNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileProductDropdownOpen, setIsMobileProductDropdownOpen] =
    useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProductDropdown = () =>
    setIsProductDropdownOpen(!isProductDropdownOpen);
  const toggleMobileProductDropdown = () =>
    setIsMobileProductDropdownOpen(!isMobileProductDropdownOpen);
  const toggleOrdersDropdown = () =>
    setIsOrdersDropdownOpen(!isOrdersDropdownOpen);

  const handleLogout = async () => {
    try {
      // Optionally, notify the server to invalidate the token (if token invalidation is needed)
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include credentials (cookies) in the request
      });

      // Remove the JWT token from the cookies
      Cookies.remove("token", { sameSite: "strict" });
      localStorage.removeItem("userdata");

      // Redirect to login page
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, show an error notification to the user
    }
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}

          <div className="flex-shrink-0">
            <Link to="/homepage">
              <img
                className="h-8 w-auto md:h-14 rounded-lg"
                src="https://res.cloudinary.com/dlx3l4a9p/image/upload/v1730382942/wjyihm0hyh0ctnkow2m0.png"
                alt="Your Company"
              />
            </Link>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/mynetwork"
              className="hidden md:block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              {/* Y're {userData && userData.role} */}
              Your Network
            </Link>
          </div>

          {/* Role Display - Responsive */}
          <div className="flex-shrink-0">
            <Link
              to="/chat"
              className="hidden md:block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              {/* Y're {userData && userData.role} */}
              Messages
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/retailerslist"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Retailers
            </Link>

            {/* Desktop Products Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProductDropdown}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                Products <ChevronDownIcon className="w-4 h-4 ml-1" />
              </button>
              {isProductDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/addproduct"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Add Product
                  </Link>
                  <Link
                    to="/productlist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    All Products
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop Orders Dropdown */}
            <div className="relative">
              <button
                onClick={toggleOrdersDropdown}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                Orders <ChevronDownIcon className="w-4 h-4 ml-1" />
              </button>
              {isOrdersDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link
                    to="/pendingorders_dist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Pending Orders
                  </Link>
                  <Link
                    to="/accepted_dist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Accepted Orders
                  </Link>
                  <Link
                    to="/rejected_dist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Rejected Orders
                  </Link>
                  <Link
                    to="/completed_dist"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Completed Orders
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/requests"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Requests
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              About
            </Link>
            <Link
              to="/complaintandreview"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Complaint
            </Link>
          </div>

          {/* Mobile and Desktop Right Section */}
          <div className="flex items-center">
            {/* User Profile Button */}
            <div className="relative mr-2">
              <button
                onClick={toggleUserMenu}
                className="bg-gray-800 flex items-center justify-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                {userData && userData.image ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={userData.image}
                    alt="User"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
                    {userData && userData.firstName
                      ? userData.firstName.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      {userData
                        ? `${userData.name || "Guest"} ${
                            userData.lastName || ""
                          }`
                        : "Guest"}
                    </div>
                    <div className="px-4 py-2 text-xs text-gray-500">
                      {userData?.email || "No email"}
                    </div>
                    <div className="px-4 py-2 text-xs text-gray-500">
                      {userData?.companyName || userData?.shopName || ""}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {userData && userData.role}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell - Desktop Only */}
            <div className="hidden md:block mr-2">
              <Link to="/newsfeed">
                <button className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white">
                  <Globe className="h-6 w-6" />
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-gray-900"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Role Display */}
            <div className="text-gray-300 px-3 py-2 text-sm">
              <Link
                to="/mynetwork"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {/* Y're {userData && userData.role} */}
                Your Network
              </Link>
              <Link
                to="/chat"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Messages
              </Link>
            </div>

            {/* Notification Link in Mobile Menu */}
            <Link
              to="/newsfeed"
              className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              <Globe className="h-6 w-6 mr-2" />
              Daily News
            </Link>

            {/* Mobile Menu Items */}
            <Link
              to="/retailerslist"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Retailers
            </Link>

            {/* Mobile Products Dropdown */}
            <div>
              <button
                onClick={toggleMobileProductDropdown}
                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
              >
                Products
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              {isMobileProductDropdownOpen && (
                <div className="pl-4 space-y-1">
                  <Link
                    to="/addproduct"
                    className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
                  >
                    Add Product
                  </Link>
                  <Link
                    to="/productlist"
                    className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
                  >
                    All Products
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Orders Dropdown */}
            <div>
              <button
                onClick={toggleOrdersDropdown}
                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
              >
                Orders
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              {isOrdersDropdownOpen && (
                <div className="pl-4 space-y-1">
                  <Link
                    to="/pendingorders_dist"
                    className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
                  >
                    Pending Orders
                  </Link>
                  <Link
                    to="/accepted_dist"
                    className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
                  >
                    Accepted Orders
                  </Link>
                  <Link
                    to="/rejected_dist"
                    className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
                  >
                    Rejected Orders
                  </Link>
                  <Link
                    to="/completed_dist"
                    className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm"
                  >
                    Completed Orders
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/requests"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Requests
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>
            <Link
              to="/complaintandreview"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Complaint
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default DistributorsNavbar;

