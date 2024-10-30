import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Phone, User, Loader2, Upload } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("retailer");
  const [companyName, setCompanyName] = useState("");
  const [shopName, setShopName] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null); // New state for image file
  const [uploading, setUploading] = useState(false); // New state for upload status
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState(null);

  useEffect(() => {
    let messageTimeout;
    if (error || success) {
      messageTimeout = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
    return () => clearTimeout(messageTimeout);
  }, [error, success]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setUploading(true);
      const response = await fetch('http://localhost:8000/api/upload/image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImage(data.url);
        return data.url;
      } else {
        setError(data.error || 'Failed to upload image');
        return null;
      }
    } catch (error) {
      setError('An error occurred while uploading the image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Keep existing OTP handling functions
  const handleSendOTP = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/otp/send-otp', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error sending OTP:", errorData);
        setError(errorData.message);
        return;
      }

      const data = await response.json();
      setOtpSentMessage(data.message);
      setOtpSent(true);
    } catch (error) {
      console.error("Failed to send OTP:", error.message);
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/otp/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpVerified(true);
        setSuccess("OTP verified successfully.");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (error) {
      setError("An error occurred while verifying OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otpVerified) {
      setError("Please verify your email with OTP before registering.");
      return;
    }

    let imageUrl = image;
    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) return; // Stop if image upload failed
    }

    const formData = {
      name,
      email,
      phone,
      password,
      role,
      companyName: role === "distributor" ? companyName : undefined,
      shopName: role === "retailer" ? shopName : undefined,
      image: imageUrl,
      address,
    };

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("An error occurred while signing up.");
    }
  };
  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } px-5`}
    >
      <div
        className={`xl:max-w-3xl w-full p-5 sm:p-10 rounded-md shadow-lg ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-center text-xl sm:text-3xl font-semibold mb-4">
          Register for a free account
        </h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mb-4 p-2 rounded-md focus:outline-none border border-gray-300"
        >
          Toggle to {darkMode ? "Light" : "Dark"} Mode
        </button>

        <div className="w-full mt-8">
          <div className="mx-auto max-w-xs sm:max-w-md md:max-w-lg flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                <input
                  className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                    darkMode
                      ? "focus:border-white bg-gray-700 text-white"
                      : "focus:border-black bg-gray-100 text-black"
                  }`}
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                <input
                  className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                    darkMode
                      ? "focus:border-white bg-gray-700 text-white"
                      : "focus:border-black bg-gray-100 text-black"
                  }`}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="relative">
              <Phone className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
              <input
                className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                  darkMode
                    ? "focus:border-white bg-gray-700 text-white"
                    : "focus:border-black bg-gray-100 text-black"
                }`}
                type="tel"
                placeholder="Enter your phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
              <input
                className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                  darkMode
                    ? "focus:border-white bg-gray-700 text-white"
                    : "focus:border-black bg-gray-100 text-black"
                }`}
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role:
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (e.target.value === "retailer") {
                    setCompanyName(""); // Clear company name if switching to retailer
                  } else {
                    setShopName(""); // Clear shop name if switching to distributor
                  }
                }}
                className={`w-full px-5 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                  darkMode
                    ? "focus:border-white bg-gray-700 text-white"
                    : "focus:border-black bg-gray-100 text-black"
                }`}
              >
                <option value="retailer">Retailer</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>
            {role === "distributor" && (
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                <input
                  className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                    darkMode
                      ? "focus:border-white bg-gray-700 text-white"
                      : "focus:border-black bg-gray-100 text-black"
                  }`}
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            )}
            {role === "retailer" && (
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                <input
                  className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                    darkMode
                      ? "focus:border-white bg-gray-700 text-white"
                      : "focus:border-black bg-gray-100 text-black"
                  }`}
                  type="text"
                  placeholder="Enter your shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="relative">
              <User className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
              <input
                className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                  darkMode
                    ? "focus:border-white bg-gray-700 text-white"
                    : "focus:border-black bg-gray-100 text-black"
                }`}
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Upload className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                <input
                  className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                    darkMode
                      ? "focus:border-white bg-gray-700 text-white"
                      : "focus:border-black bg-gray-100 text-black"
                  }`}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {uploading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Image preview */}
              {image && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Mail className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-500" />
                <input
                  className={`w-full px-10 py-3 rounded-lg font-medium border-2 border-transparent placeholder-gray-500 text-sm focus:outline-none focus:border-2 ${
                    darkMode
                      ? "focus:border-white bg-gray-700 text-white"
                      : "focus:border-black bg-gray-100 text-black"
                  }`}
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={!otpSent || otpVerified}
                />
              </div>
              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  className="px-5 py-3 rounded-lg font-medium bg-[#E9522C] text-white flex items-center gap-2 disabled:opacity-50"
                  disabled={!email}
                >
                  Send OTP <Loader2 className="animate-spin" />
                </button>
              ) : !otpVerified ? (
                <button
                  onClick={handleVerifyOTP}
                  className="px-5 py-3 rounded-lg font-medium bg-[#E9522C] text-white flex items-center gap-2 disabled:opacity-50"
                  disabled={!otp}
                >
                  Verify OTP <Loader2 className="animate-spin" />
                </button>
              ) : (
                <span className="px-5 py-3 rounded-lg font-medium bg-green-500 text-white flex items-center gap-2">
                  Verified
                </span>
              )}
            </div>

            {otpSentMessage && (
              <div className="mt-4 bg-green-100 text-green-500 p-2 rounded-md animate-fade-in">
                {otpSentMessage}
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-100 text-red-500 p-2 rounded-md animate-fade-in">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-4 bg-green-100 text-green-500 p-2 rounded-md animate-fade-in">
                {success}
              </div>
            )}

            <button
              type="submit"
              onClick={handleSubmit}
              className={`mt-5 tracking-wide font-semibold bg-[#E9522C] text-gray-100 w-full py-4 rounded-lg hover:bg-[#E9522C]/90 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none disabled:opacity-50`}
              disabled={!otpVerified}
            >
              Register
            </button>

            <p className="mt-6 text-xs text-gray-600 text-center dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/auth/login">
                <span className="text-[#E9522C] font-semibold">Log in</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;