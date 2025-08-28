// Sidebar component (for desktop)
import React from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch,useSelector} from 'react-redux';
import { logoutUser } from "../../redux/slices/authSlice";
import { logoutAdmin } from "../../redux/slices/adminAuthSlice";
import {Globe,LogOut,Icon,X,LayoutDashboard,User,MessageCircle,Bell,Settings,PlusSquareIcon} from 'lucide-react';
import axios from "axios";

const Sidebar = ({ activePage, onNavigate, isSidebarOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLogout = async()=>{
   try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/logout`,{},{withCredentials:true})
      dispatch(logoutAdmin());
      dispatch(logoutUser());
      navigate('/login')
    } catch (error) {
      console.error("Logout::",error);
    }
  }
  return (
    <> 
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 md:hidden" onClick={onClose}></div>
      )}
      <aside 
        className={`
          fixed inset-y-0 bottom-16 hide-scrollbar overflow-y-auto left-0 w-64 bg-gray-900 text-gray-300 shadow-xl flex-col z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0 flex' : '-translate-x-full hidden'}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold text-white">CampusConnect</h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-800 text-gray-400 md:hidden">
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <UserCard onNavigate={onNavigate} onClose={onClose} />
          <SidebarNavigation activePage={activePage} onNavigate={onNavigate} onClose={onClose} />
        </nav>
        
        {/* Logout button at the bottom */}
        <div className="mt-auto p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors duration-200">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarNavigation = ({ activePage, onNavigate, onClose }) => {
  const links = [
    { name: "Feed", path: "posts", icon: LayoutDashboard },
    { name: "Profile", path: "profile", icon: User },
    { name: "Chat", path: "chat", icon: MessageCircle },
    { name: "Create Post", path: "createPost", icon: PlusSquareIcon },
    { name: "Notifications", path: "notifications", icon: Bell },
    { name: "Settings", path: "settings", icon: Settings },
  ];
  return (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = activePage === link.path;
        return (
          <button
            key={link.path}
            onClick={() => { onNavigate(link.path); onClose(); }}
            className={`
              w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
              ${isActive
                ? "bg-blue-600 text-white shadow-md" 
                : "hover:bg-gray-800 hover:text-blue-200"
              }
            `}
          >
            <Icon size={20} />
            <span className="font-medium">{link.name}</span>
          </button>
        );
      })}
    </>
  );
};

// User Profile Card on the left sidebar
const UserCard = ({ onNavigate, onClose }) => {
   const {user} = useSelector((state)=>state.auth);
  return (
    <div className="bg-white p-2 rounded-xl shadow-md space-y-1 text-center">
      <img 
        src={user.profilePicture}
        alt="User Avatar"
        className="w-16 h-16 rounded-full mx-auto border-4 border-blue-500"
      />
      <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
      <p className="text-gray-500">@{user.name.replaceAll(' ','')}</p>
      <button onClick={() => { onNavigate('profile'); onClose(); }} className="inline-block bg-gray-100 text-gray-600 font-medium px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
        View Profile
      </button>
    </div>
  );
};

export default Sidebar;