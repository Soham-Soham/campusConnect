import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  MessageCircle,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Heart,
  MessageSquare,
  Share2,
  Image as ImageIcon,
  Send,
  UserPlus,
  ArrowLeft,
  Search,
  MoreVertical,
  Globe,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

import {Sidebar,PageContent,BottomNavigation,CreatePost} from '../Components/userDashboardComponents/index.js'

// Main App component that manages all the state and renders the correct page
export default function UserDashboard() {
  const [activePage, setActivePage] = useState('posts'); // Dashboard starts on the posts page

  return (
    <UserDashboardLayout 
      activePage={activePage} 
      onNavigate={setActivePage} 
    />
  );
}


// --- User Dashboard Layout and Sub-Pages ---

const UserDashboardLayout = ({ activePage, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 font-inter text-gray-800 w-full">
      {/* Desktop Sidebar */}
      <Sidebar 
        activePage={activePage} 
        onNavigate={onNavigate} 
        isSidebarOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0 h-screen">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden sticky top-0 bg-white p-4 shadow-sm flex items-center justify-between z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-200">
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold">CampusConnect</h1>
        </div>
        
        {/* Main content view - 3 column layout */}
        <div className="flex flex-col lg:flex-row p-6 lg:p-10">
          
          {/* Main Content Area */}
          <div className="flex-1 w-full mx-auto">
            <PageContent activePage={activePage} />
          </div>

        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNavigation activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
};





