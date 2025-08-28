import React, { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, Trash, Mail, Search } from 'lucide-react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState('All');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetching data from the backend
  useEffect(() => {
    setLoading(true);
    const allPreApprovedUser = async()=>{
        try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/admin//getPreApprovedUsers`,{withCredentials:true})
        setUsers(res.data?.users || [])
       } catch (error) {
        console.error("Users::",error);
       } finally {
         setLoading(false);
       }
    }
    allPreApprovedUser();
  }, []);

  const handleFilterChange = (e) => {
    setFilteredRole(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, you would make an API call to delete the user.
      setUsers(users.filter(user => user._id !== userId));
    }
  };

  const handleResendVerification = (email) => {
    alert(`Verification email resent to ${email}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filteredRole === 'All' || user.role === filteredRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <p className="text-gray-600 mb-6">View, filter, and manage all registered users in the system.</p>

      {/* Control Panel: Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <label htmlFor="role-filter" className="text-sm font-medium text-gray-700">Filter by Role:</label>
          <select
            id="role-filter"
            value={filteredRole}
            onChange={handleFilterChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          >
            <option value="All">All</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length > 0 ? (
                currentUsers.map((user,index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'student' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isRegistered ? (
                        <span className="flex items-center text-green-500">
                          <CheckCircle size={16} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <XCircle size={16} className="mr-1" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!user.isVerified && (
                          <button
                            onClick={() => handleResendVerification(user.email)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Resend Verification Email"
                          >
                            <Mail size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
