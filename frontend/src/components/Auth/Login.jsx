import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import the js-cookie library

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("retailer"); // Default role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  
  useEffect(() => {
    
      const validateToken = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/validate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body:"asdjfsajdlgkjaslkg",
            credentials: "include",
          });
          console.log(response)
          const data = await response.json();

          if (response.ok) {
            // Token is valid, redirect based on user role
            console.log(JSON.parse(localStorage.getItem('userdata')))
            if (JSON.parse(localStorage.getItem('userdata')).role === "distributor") {
              window.location.href = "/homepage"; // Redirect to distributor dashboard
            } else if (JSON.parse(localStorage.getItem('userdata')).role === "retailer") {
              window.location.href = "/homepageretailer"; // Redirect to retailer dashboard
            } else if (JSON.parse(localStorage.getItem('userdata')).role === "admin") {
              window.location.href = "/adminhome"; // Redirect to admin dashboard
            }
          } else {
            Cookies.remove("token");

            // If token is invalid, remove it
          }
        } catch (error) {
          console.error("Token validation failed:", error);
        }
      };

      validateToken();
    
  }, []); // Empty dependency array means this runs only once after the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const loginData = { email, password, role };

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include", // This ensures cookies are included with requests
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        setSuccess(data.message);

        // Set the token as a cookie
        Cookies.set("token", data.token, {
          expires: 30,
          // secure: true,
          sameSite: "strict",
        });
        localStorage.setItem('userdata', JSON.stringify(data.user));
        // 1-hour expiry, sent over HTTPS, and protects against CSRF attacks.

        // Redirect based on user role
        if (data.user.role === "distributor") {
          window.location.href = "/homepage"; // Redirect to distributor dashboard
        } else if (data.user.role === "retailer") {
          window.location.href = "/homepageretailer"; // Redirect to retailer dashboard
        } else if (data.user.role === "admin") {
          window.location.href = "/adminhome"; // Redirect to admin dashboard
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred while logging in.");
    }
  };

  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
      {/* Left: Image */}
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Right: Login Form */}
      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-600">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
            />
          </div>
          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-800">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
            />
          </div>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-gray-700">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            >
              <option value="retailer">Retailer</option>
              <option value="distributor">Distributor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {/* Login Button */}
          <button
            type="submit"
            className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        {success && (
          <p className="mt-4 text-green-500 text-center">{success}</p>
        )}
        <div className="mt-6 text-center text-gray-600">
          New user?{" "}
          <Link to="/auth/signup" className="text-blue-500 hover:underline">
            Sign up Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
