import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/slices/authSlice';
import { ArrowLeft, Eye, EyeOff, Globe } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState(null);
    const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    const checkAdmin = async()=>{
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/currentUser`,{withCredentials: true});
        dispatch(setUser(res.data))
        navigate('/dashboard')
      } catch (error) {
        console.log(error);
      }
    }
    checkAdmin()
  }, []);


  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/login`,{email,password},{withCredentials:true})
      if(res.data?.user){
        dispatch(setUser(res.data.user))
        setLoading(false);
        navigate('/dashboard')
      }else{
        console.log("Invalid response from server");
      }
    } catch (error) {
      console.error(error?.response?.data?.message);
      setError(error?.response?.data?.message);
      setLoading(false);
      setEmail('');
      setPassword('');
    }
   
  };
  
 
  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleRegister = () => {
    navigate('/register');
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
            Connect. <br />
            Collaborate. <br />
            Innovate.
          </h1>
          <p className="mt-4 text-gray-300">
            Join the community and transform your campus experience.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
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
            Welcome Back!
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Sign in to continue to your account.
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
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
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

            {/* Forgot password link */}
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
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

          {/* Admin Login and Register buttons */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to CampusConnect?{' '}
              <button
                onClick={handleRegister}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Create an account
              </button>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Are you an administrator?{' '}
              <button
                onClick={handleAdminLogin}
                className="font-medium text-purple-600 hover:text-purple-500 focus:outline-none"
              >
                Log in as Admin
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
