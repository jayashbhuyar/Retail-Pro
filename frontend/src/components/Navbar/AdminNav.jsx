import { useState, useEffect } from "react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { Globe } from "lucide-react";


const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      // Optionally, notify the server to invalidate the token (if token invalidation is needed)
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials (cookies) in the request
      });
  
      // Remove the JWT token from the cookies
      Cookies.remove('token', { secure: true, sameSite: 'strict' });
      localStorage.removeItem('userdata')
  
      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, show an error notification to the user
    }
  };

  return (
    <div>
      <nav className="bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-25">
            <div className="flex-shrink-0">
              <Link to="/adminhome">
                <img
                  className="h-14 w-auto max-w-full rounded-lg"
                 src="https://res.cloudinary.com/dlx3l4a9p/image/upload/v1730382942/wjyihm0hyh0ctnkow2m0.png"
                  alt="Company Logo"
                />
              </Link>
            </div>

            <Link
              to="/homepagenew"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Hello {userData && userData.role}
            </Link>

            <div className="hidden sm:flex sm:space-x-6">
              <Link
                to="/adminretailerlist"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Retailers
              </Link>

              {/* Replace Product Dropdown with Product Link */}
              <Link
                to="/admindistributorslist"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Distributors
              </Link>

              {/* Replace Orders Dropdown with Orders Link */}
              <Link
                to="/adminproductlist"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>

              <Link
                to="/admincomplaints"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Complaints!
              </Link>
              <Link
              to="/newsfeed"
              className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              <Globe className="h-6 w-6 mr-2" />
              Daily News
            </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white"
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
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700">
                    {userData
                      ? `${userData.firstName || "Guest"} ${
                          userData.lastName || ""
                        }`
                      : "Guest"}
                  </div>
                  <div className="px-4 py-2 text-xs text-gray-500">
                    {userData?.email || "No email"}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
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
            className="sm:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/retailerslist"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Retailers
              </Link>
              {/* Other mobile menu options */}
            </div>
          </motion.div>
        )}
      </nav>
      {/* Add the main admin page content here */}
    </div>
  );
};

export default AdminNav;
