import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Globe } from 'lucide-react';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/reset-password/${token}`,{newPassword:password,confirmPassword:confirmPassword},{withCredentials: true});
      console.log(res);
      // Simulate a successful password reset
      setMessage("Password reset successful. Redirecting to login...");
      
      // Redirect to login after a short delay
      setTimeout(() => navigate("/login"), 2000);
      
    } catch (err) {
      // Simulate an error, for example, if the token is invalid
      console.log(err);
      
      setError("Invalid or expired token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen font-inter">
      {/* Left side: Branding and message */}
      <div className="relative hidden w-1/2 items-center justify-center bg-gray-900 p-8 text-white lg:flex">
        <div className="absolute top-8 left-8 flex items-center space-x-2">
          <Globe className="h-6 w-6 text-blue-400" />
          <span className="text-xl font-bold">CampusConnect</span>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-extrabold leading-tight">
            Reset Your <br />
            Password
          </h1>
          <p className="mt-4 text-gray-300">
            Choose a strong, new password to secure your account.
          </p>
        </div>
      </div>

      {/* Right side: Reset Password Form */}
      <div className="relative flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 rounded-full p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-full max-w-sm rounded-lg bg-white p-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
            Reset Password
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Please enter your new password.
          </p>
          
          {/* Display messages for success or error */}
          {message && (
            <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* New Password input field with toggle */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">New Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password input field with toggle */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-400"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Go back to{' '}
              <button
                onClick={handleLoginRedirect}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
