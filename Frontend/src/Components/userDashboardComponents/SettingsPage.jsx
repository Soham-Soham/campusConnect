import { useState } from "react";
import {User,EyeOff,Eye} from 'lucide-react';
import {useSelector} from "react-redux";
import axios from "axios";

const SettingsPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  const {user} = useSelector((state => state.auth))

  const handlePasswordChange = async(e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return; 
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/changePassword`,{currentPassword,newPassword},{withCredentials: true});
    
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error?.response?.data?.message });
    }

  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
      {/* User Profile Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 border-b pb-4 border-gray-200">Account Information</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={32} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      
      {/* Change Password Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 border-b pb-4 border-gray-200">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          {passwordMessage && (
            <div className={`p-3 rounded-md text-sm ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {passwordMessage.text}
            </div>
          )}
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};


export default SettingsPage;