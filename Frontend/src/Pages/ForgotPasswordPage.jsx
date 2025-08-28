import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Key } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
 
    // Simulate an API call to send a reset link
    try {
      // Simulate success or failure based on a condition
      if (email.includes('@')) {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/forgot-password`,{email},{withCredentials: true});
        console.log(res);
        
        setMessage("Password reset link sent to your email. Please check your inbox.");
      } else {
        throw new Error("Please enter a valid email address.");
      }
      
    } catch (err) {
      console.log(err); 
      setError(err.message || "Something went wrong. Please try again.");
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
            Forgot your <br />
            password?
          </h1>
          <p className="mt-4 text-gray-300">
            Don't worry, we'll help you get back on track.
          </p>
        </div>
      </div>

      {/* Right side: Forgot Password Form */}
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
            Forgot Password
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Enter your email to receive a password reset link.
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
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <button
                onClick={handleLoginRedirect}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
