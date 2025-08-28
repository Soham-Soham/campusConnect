import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const UploadUsers = () => {
  const [role, setRole] = useState('student');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // New state for drag-and-drop visual feedback

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setMessage(null);
  };
  
  // New handler for drag-and-drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setMessage(null);
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Simulate an API call for file upload
    try {
      // In a real application, you would create a FormData object
      const formData = new FormData();
      formData.append('role', role);
      formData.append('file', file);
      
      // And then send it to your backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/admin/upload-users`, formData);

      setMessage({ type: 'success', text: `Successfully uploaded ${file.name} for ${role}s.` });
      setFile(null);
    } catch (error) {
      console.error("UploadUsers::",error);
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Pre-Approved User Upload</h2>
      <p className="text-gray-600 mb-6">This page allows administrators to bulk upload user data via CSV or Excel files. Select a role and upload the corresponding file.</p>
      
      {/* Display success or error messages */}
      {message && (
        <div className={`p-4 mb-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role selection dropdown */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Select User Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={handleRoleChange}
            className="w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="student">student</option>
            <option value="teacher">teacher</option>
          </select>
        </div>

        {/* File upload input */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload File (CSV/Excel)</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            `}
          >
            <div className="space-y-1 text-center">
              <Upload size={32} className="mx-auto text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, .xlsx" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {file ? file.name : "CSV or XLSX up to 10MB"}
              </p>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Users'}
        </button>
      </form>
    </div>
  );
};

export default UploadUsers;
