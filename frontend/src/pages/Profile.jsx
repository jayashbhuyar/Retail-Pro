import React, { useState, useEffect } from 'react';
import { Lock, LogOut, User, Building2, Mail, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // New state for profile image

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem("userdata");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
  
      // Fetch profile image
      fetch(`http://localhost:8000/api/users/profile-image?email=${parsedUserData.email}`, {
        method: 'GET',
        credentials: 'include', // This is for handling cookies if needed
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error fetching profile image");
          }
        })
        .then((data) => {
          if (data.profileImage) {
            setProfileImage(data.profileImage);
          }
        })
        .catch((error) => console.error("Error fetching profile image:", error));
    }
  }, []);
  

  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/pass/auth/update-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
    }
  };
  

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      Cookies.remove("token", { sameSite: "strict" });
      localStorage.removeItem("userdata");

      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {message && (
          <div 
            className={`mb-4 p-4 rounded-lg shadow-sm flex items-center justify-between ${
              message.type === 'error' ? 'bg-red-100 text-red-700 border-l-4 border-red-500' 
              : 'bg-green-100 text-green-700 border-l-4 border-green-500'
            }`}
          >
            <p>{message.text}</p>
            <button 
              onClick={() => setMessage(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-white p-1">
                    <img
                      src={profileImage || "/api/placeholder/150/150"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-center">
                    {userData ? `${userData.name || ''} ${userData.lastName || ''}` : 'Guest'}
                  </h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{userData?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm">{userData?.companyName || userData?.shopName || 'No company'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <User className="w-5 h-5" />
                    <span className="text-sm capitalize">{userData?.role || 'User'}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Link
                    to="/newsfeed"
                    className="w-full p-3 rounded-lg flex items-center space-x-3 text-gray-600 hover:bg-gray-50 transition"
                  >
                    <Globe className="w-5 h-5" />
                    <span>News Feed</span>
                  </Link>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full p-3 rounded-lg flex items-center space-x-3 transition ${
                      activeTab === 'security'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Lock className="w-5 h-5" />
                    <span>Security</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full p-3 rounded-lg flex items-center space-x-3 text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Security Settings</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                <p className="text-blue-700 text-sm">
                  Ensure your account is using a strong password to protect your account.
                </p>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
