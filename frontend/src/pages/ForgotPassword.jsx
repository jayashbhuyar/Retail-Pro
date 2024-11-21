import React, { useState, useEffect } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (error || success) {
      const timeout = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, success]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/passchange/api/otp/send-otp-1", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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
      setSuccess(data.message);
      setOtpSent(true);
      setResendTimer(30);
    } catch (error) {
      console.error("Failed to send OTP:", error.message);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer === 0) {
      try {
        setIsResending(true);
        const response = await fetch("http://localhost:8000/passchange/api/otp/send-otp-1", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message);
          return;
        }

        const data = await response.json();
        setSuccess(data.message);
        setResendTimer(30);
      } catch (error) {
        setError("Failed to resend OTP. Please try again.");
      } finally {
        setIsResending(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/passchange/api/otp/verify-otp-1", {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccess(
          "Password reset successfully. Please login with your new password."
        );
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-5 py-8">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h1>

        {!otpSent ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email:</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              Send OTP
            </button>
          </>
        ) : otpSent && !otpVerified ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Enter OTP:</label>
              <input
                type="text"
                className="w-full py-2 px-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200 flex items-center justify-center mb-3"
            >
              Verify OTP
            </button>
            <button
              onClick={handleResendOTP}
              disabled={resendTimer > 0 || isResending}
              className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 disabled:opacity-50 flex items-center justify-center"
            >
              {isResending ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Password:</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Confirm New Password:
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : null}
              Reset Password
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 mt-3 text-center font-medium">{error}</p>
        )}
        {success && (
          <div className="text-green-500 mt-3 text-center">
            <p className="font-medium">{success}</p>
            {success.includes("successfully") && (
              <Link
                to="/auth/login"
                className="text-blue-500 hover:text-blue-600 underline mt-2 inline-block"
              >
                Login Here
              </Link>
            )}
          </div>
        )}

        {!otpSent && (
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;