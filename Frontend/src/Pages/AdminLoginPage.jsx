import React, { useState, useEffect } from 'react';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Globe, Lock } from 'lucide-react';
import axios from 'axios';
import {setAdmin} from "../redux/slices/adminAuthSlice"

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(()=>{
    const checkAdmin = async()=>{
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/currentUser`,{withCredentials: true});
        // console.log(res.data);
        dispatch(setAdmin(res.data))
        navigate('/admin/dashboard')
      } catch (error) {
        console.log(error);
      }
    }
    checkAdmin()
  },[])
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/login`,
      { email, password },
      { withCredentials: true }
    );
    
    if(res.data?.admin){
      dispatch(setAdmin(res.data.admin));
      navigate('/admin/dashboard');
    }else{
      setError("Invalid response from server");
    }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally{
      setLoading(false)
    }

    
  };
  
  // Handler for the "User Login" button
  const handleUserLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen font-inter">
      {/* Left side: Hero image and branding */}
      <div className="relative hidden w-1/2 items-center justify-center bg-gray-900 p-8 text-white lg:flex">
        <div className="absolute top-8 left-8 flex items-center space-x-2">
          <Globe className="h-6 w-6 text-blue-400" />
          <span className="text-xl font-bold">CampusConnect</span>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-extrabold leading-tight">
            Admin Portal <br />
            <span className="text-blue-400">Secure Access</span>
          </h1>
          <p className="mt-4 text-gray-300">
            Manage the platform and community with powerful tools.
          </p>
        </div>
      </div>

      {/* Right side: Admin Login Form */}
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
            Admin Login
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Please enter your administrator credentials.
          </p>
          
          {/* Display login error messages */}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Password input field with toggle button */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
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

            {/* Main login button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Link to go back to the user login page */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not an administrator?{' '}
              <button
                onClick={handleUserLogin}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Log in as a user
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
