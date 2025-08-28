import React from 'react';
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


const Overview = () => {
  const stats = [
      { title: "Total Users", value: "1,345", icon: LucideUsers, color: "bg-blue-500" },
      { title: "Active Users", value: "245", icon: Activity, color: "bg-green-500" },
      { title: "New Teachers", value: "32", icon: UserPlus, color: "bg-purple-500" },
      { title: "Reported Content", value: "12", icon: AlertTriangle, color: "bg-red-500" },
    ];
    const userGrowthData = [
      { name: 'Jan', 'Users': 400 },
      { name: 'Feb', 'Users': 300 },
      { name: 'Mar', 'Users': 500 },
      { name: 'Apr', 'Users': 600 },
      { name: 'May', 'Users': 800 },
      { name: 'Jun', 'Users': 950 },
    ];
    const postActivityData = [
      { name: 'Mon', 'Posts': 20 },
      { name: 'Tue', 'Posts': 35 },
      { name: 'Wed', 'Posts': 45 },
      { name: 'Thu', 'Posts': 28 },
      { name: 'Fri', 'Posts': 55 },
      { name: 'Sat', 'Posts': 60 },
      { name: 'Sun', 'Posts': 40 },
    ];
  
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center p-6 bg-white rounded-xl shadow-md">
              <div className={`p-3 rounded-full text-white ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-500">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="Users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Post Activity (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Posts" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
}

export default Overview 