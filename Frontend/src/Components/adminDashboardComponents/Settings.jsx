import React,{useState} from 'react';
import { LucideUsers } from 'lucide-react';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [inviteMessage, setInviteMessage] = useState(null);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setTimeout(() => {
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };
  const handleInviteAdmin = (e) => {
    e.preventDefault();
    setInviteMessage(null);
    setTimeout(() => {
      setInviteMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}.` });
      setInviteEmail('');
    }, 1500);
  };
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 border-b pb-4 border-gray-200">Admin Profile</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <LucideUsers size={32} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Admin Name</h3>
            <p className="text-gray-500">admin@campusconnect.com</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Settings 