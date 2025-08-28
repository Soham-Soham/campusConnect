import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Globe, Mail, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/users/verify/${token}`
        );
        setMessage("Your email has been verified!");
        setErrorMsg("");
        setLoading(false);
  
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.error(err);
        setMessage("");
        setErrorMsg(
          "Email verification failed. The token may be invalid or expired."
        );
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
    
  }, [token]);

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
            Email <br />
            Verification
          </h1>
          <p className="mt-4 text-gray-300">
            Confirm your account to join the community.
          </p>
        </div>
      </div>

      {/* Right side: Verification Status */}
      <div className="relative flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-md">
          {loading && (
            <div className="flex flex-col items-center justify-center">
              <Mail size={48} className="animate-pulse text-blue-500 mb-4" />
              <h2 className="text-xl font-bold text-gray-900">Verifying your email...</h2>
              <p className="mt-2 text-gray-500">Please wait while we confirm your account.</p>
            </div>
          )}
          {!loading && message && (
            <div className="flex flex-col items-center justify-center text-green-600">
              <CheckCircle size={48} className="mb-4" />
              <h2 className="text-xl font-bold">Success!</h2>
              <p className="mt-2 text-gray-800">{message}</p>
              <p className="text-sm text-gray-500 mt-1">You will be redirected shortly.</p>
            </div>
          )}
          {!loading && errorMsg && (
            <div className="flex flex-col items-center justify-center text-red-600">
              <XCircle size={48} className="mb-4" />
              <h2 className="text-xl font-bold">Verification Failed</h2>
              <p className="mt-2 text-gray-800">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
