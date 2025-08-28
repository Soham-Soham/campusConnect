import React, { useState } from "react";
import {
  LayoutDashboard,
  Upload,
  FileText,
  MessageCircle,
  Settings as LucideSettings,
  LogOut,
  Activity,
  UserPlus,
  Globe,
  Users as LucideUsers, // Renamed the icon to avoid conflict
  Menu, // New icon for mobile menu
  X, // New icon for closing mobile menu
  Key,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

import {Overview,Users,Settings,Posts,UploadUsers} from "../Components/adminDashboardComponents/index.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../redux/slices/adminAuthSlice.js";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter text-gray-800">
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden sticky top-0 bg-white p-4 shadow-sm flex items-center justify-between z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-200">
            <Menu size={24} />
          </button>
          <div className="text-xl font-bold">Admin Panel</div>
        </div>

        {/* Main content area */}
        <main className="p-6 lg:p-10 h-screen overflow-scroll">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {links.find(link => link.path === activePage)?.name}
            </h1>
            <p className="mt-1 text-gray-600">
              {links.find(link => link.path === activePage)?.description}
            </p>
          </header>
          
          <PageContent activePage={activePage} />
        </main>
      </div>
    </div>
  );
}

// Data for the sidebar links
const links = [
  { name: "Dashboard Overview", path: "overview", icon: LayoutDashboard, description: "Get a high-level view of your platform's statistics." },
  { name: "Upload Users", path: "upload-users", icon: Upload, description: "Bulk upload new users to the system." },
  { name: "User Management", path: "users", icon: LucideUsers, description: "View and manage all registered users." },
  { name: "Post Moderation", path: "posts", icon: FileText, description: "Manage posts and content created by users." },
  { name: "Settings", path: "settings", icon: LucideSettings, description: "Configure platform settings and admin profiles." },
];

// Sidebar component
const Sidebar = ({ activePage, onNavigate, isSidebarOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async()=>{
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/logout`,{},{withCredentials:true})
      dispatch(logoutAdmin());
      navigate('/admin/login')
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
          fixed inset-y-0 left-0 w-64 bg-gray-900 text-gray-300 shadow-xl flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-800 text-gray-400 md:hidden">
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => { onNavigate(link.path); onClose(); }}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                  ${activePage === link.path 
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

// Component to render the correct page content
const PageContent = ({ activePage }) => {
  switch (activePage) {
    case "overview":
      return <Overview />;
    case "upload-users":
      return <UploadUsers />;
    case "users":
      return <Users />;
    case "posts":
      return <Posts />;
    case "settings":
      return <Settings />;
    default:
      return <Overview />;
  }
};

