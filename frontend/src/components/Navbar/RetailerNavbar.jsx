import { useState, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Globe } from "lucide-react";

const RetailerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileProductDropdownOpen, setIsMobileProductDropdownOpen] =
    useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false);
  const [isMobileOrdersDropdownOpen, setIsMobileOrdersDropdownOpen] =
    useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      Cookies.remove("token", { secure: true, sameSite: "strict" });
      localStorage.removeItem("userdata");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const UserAvatar = ({ size = "h-8 w-8" }) =>
    userData && userData.image ? (
      <img
        className={`${size} rounded-full object-cover`}
        src={userData.image}
        alt="User"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/40";
        }}
      />
    ) : (
      <div
        className={`${size} rounded-full bg-gray-500 flex items-center justify-center text-white`}
      >
        {userData && userData.firstName ? (
          <span className="text-lg font-medium">
            {userData.firstName.charAt(0).toUpperCase()}
          </span>
        ) : (
          <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
        )}
      </div>
    );

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out"
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
    >
      {children}
    </Link>
  );

  const DesktopDropdownMenu = ({ isOpen, toggle, title, children }) => (
    <div className="relative">
      <button
        onClick={toggle}
        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300 ease-in-out flex items-center"
      >
        {title} <ChevronDownIcon className="w-5 h-5 ml-1" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  );

  const MobileDropdownMenu = ({ isOpen, toggle, title, children }) => (
    <div>
      <button
        onClick={toggle}
        className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
      >
        {title} <ChevronDownIcon className="w-5 h-5 inline ml-1" />
      </button>
      {isOpen && <div className="pl-6 space-y-1">{children}</div>}
    </div>
  );

  const UserMenuContent = ({ isMobile }) => (
    <div
      className={`
      origin-top-right absolute right-0 mt-2 w-64 rounded-lg shadow-lg 
      bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50
      ${isMobile ? "sm:hidden" : "hidden sm:block"}
    `}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <UserAvatar size="h-12 w-12" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userData
                ? `${userData.name || "Guest"} ${userData.lastName || ""}`
                : "Guest"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userData?.email || "No email"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {userData?.companyName || userData?.shopName || ""}
            </p>
          </div>
        </div>
      </div>
      <div className="py-1">
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
        <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200">
          {userData && userData.role}
        </div>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/homepageretailer">
              <img
                className="h-14 w-auto rounded-lg"
                src="https://res.cloudinary.com/dlx3l4a9p/image/upload/v1730382942/wjyihm0hyh0ctnkow2m0.png"
                alt="Your Company"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <NavLink to="/retailerNetwork">Your Network</NavLink>
            <NavLink to="/chat">Messages</NavLink>
            <NavLink to="/distributorslist">Distributors</NavLink>

            {/* Products Dropdown */}
            <DesktopDropdownMenu
              isOpen={isProductDropdownOpen}
              toggle={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
              title="Products"
            >
              <Link
                to="/latestproduct"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                New Product
              </Link>
              <Link
                to="/productlistall"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                All Products
              </Link>
            </DesktopDropdownMenu>

            {/* Orders Dropdown */}
            <DesktopDropdownMenu
              isOpen={isOrdersDropdownOpen}
              toggle={() => setIsOrdersDropdownOpen(!isOrdersDropdownOpen)}
              title="Orders"
            >
              <Link
                to="/pendingretail"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Pending Orders
              </Link>
              <Link
                to="/acceptedretail"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Accepted Orders
              </Link>
              <Link
                to="/rejectedretail"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Rejected Orders
              </Link>
              <Link
                to="/completedretail"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Completed Orders
              </Link>
            </DesktopDropdownMenu>

            <NavLink to="/invoicepage">Invoices</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/complaintandreview">Complaint</NavLink>
          </div>

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Daily News Bell */}
            <div className="hidden sm:block">
              <Link to="/newsfeed">
                <button className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">View News</span>
                  <Globe className="h-6 w-6" aria-hidden="true" />
                </button>
              </Link>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="bg-gray-800 flex items-center justify-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white p-1"
              >
                <span className="sr-only">Open user menu</span>
                <UserAvatar />
              </button>
              {isUserMenuOpen && <UserMenuContent isMobile={false} />}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="sm:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/retailerNetwork">Your Network</MobileNavLink>
            <MobileNavLink to="/chat">Messages</MobileNavLink>
            <MobileNavLink to="/distributorslist">Distributors</MobileNavLink>

            {/* Mobile Products Dropdown */}
            <MobileDropdownMenu
              isOpen={isMobileProductDropdownOpen}
              toggle={() =>
                setIsMobileProductDropdownOpen(!isMobileProductDropdownOpen)
              }
              title="Products"
            >
              <MobileNavLink to="/latestproduct">New Product</MobileNavLink>
              <MobileNavLink to="/productlistall">All Products</MobileNavLink>
            </MobileDropdownMenu>

            {/* Mobile Orders Dropdown */}
            <MobileDropdownMenu
              isOpen={isMobileOrdersDropdownOpen}
              toggle={() =>
                setIsMobileOrdersDropdownOpen(!isMobileOrdersDropdownOpen)
              }
              title="Orders"
            >
              <MobileNavLink to="/pendingretail">Pending Orders</MobileNavLink>
              <MobileNavLink to="/acceptedretail">
                Accepted Orders
              </MobileNavLink>
              <MobileNavLink to="/rejectedretail">
                Rejected Orders
              </MobileNavLink>
              <MobileNavLink to="/completedretail">
                Completed Orders
              </MobileNavLink>
            </MobileDropdownMenu>

            <MobileNavLink to="/invoicepage">Invoices</MobileNavLink>
            <MobileNavLink to="/about">About</MobileNavLink>
            <MobileNavLink to="/complaintandreview">Complaint</MobileNavLink>
            <MobileNavLink
              to="/newsfeed"
              className="inline-flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              <Globe className="h-6 w-6 mr-2" />
              Daily News
            </MobileNavLink>
          </div>
        </motion.div>
      )}

      {/* Mobile User Menu */}
      {isUserMenuOpen && <UserMenuContent isMobile={true} />}
    </nav>
  );
};

export default RetailerNavbar;
