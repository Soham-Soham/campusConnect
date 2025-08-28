import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Globe, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student", // default role
    college: "",
    department: "",
    expertise: ""
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      // Create a URL for the selected file for preview
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      data.append("college", formData.college);
      data.append("department", formData.department);
      if (formData.role === 'Teacher' && formData.expertise) {
        data.append("expertise", formData.expertise);
      }
      if (avatar) {
        data.append("avatar", avatar);
      }

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/register`,
      data,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials: true,
      })

      setSuccessMessage("Registration successful! Redirecting to login...");
      setLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (apiError) {
      console.error("RegisterPage::", apiError.response?.data?.message);
      setLoading(false);
      setError(apiError.response?.data?.message);
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
            Ready to get <br />
            started?
          </h1>
          <p className="mt-4 text-gray-300">
            Create your account and join the community today.
          </p>
        </div>
      </div>

      {/* Right side: Registration Form */}
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
            Create an Account
          </h2>
          <p className="mb-6 text-center text-sm text-gray-500">
            Join the CampusConnect community.
          </p>
          
          {/* Display messages for success or error */}
          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name input field */}
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Password input field with toggle button */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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

            {/* Role selection dropdown */}
            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>

            {/* College input field */}
            <div>
              <label htmlFor="college" className="sr-only">College</label>
              <input
                id="college"
                name="college"
                type="text"
                required
                placeholder="College"
                value={formData.college}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Department input field */}
            <div>
              <label htmlFor="department" className="sr-only">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                required
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Expertise field for teachers only */}
            {formData.role === 'Teacher' && (
              <div>
                <label htmlFor="expertise" className="sr-only">Expertise</label>
                <input
                  id="expertise"
                  name="expertise"
                  type="text"
                  required
                  placeholder="Expertise (e.g., Computer Science)"
                  value={formData.expertise}
                  onChange={handleChange}
                  className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            )}
            
            {/* Optional Avatar upload field */}
            <div className="flex flex-col items-center">
              <label htmlFor="avatar" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <ImageIcon size={20} />
                <span>Upload Avatar (optional)</span>
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" // Hide the default file input button
              />
              {avatarPreview && (
                <div className="mt-4">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="h-20 w-20 rounded-full object-cover shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
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

export default RegisterPage;
