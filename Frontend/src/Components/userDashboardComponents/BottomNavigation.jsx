import {LayoutDashboard,MessageCircle,Bell,User} from 'lucide-react';

// Bottom Navigation Bar for Mobile
const BottomNavigation = ({ activePage, onNavigate }) => {
  const links = [
    { name: "Feed", path: "posts", icon: LayoutDashboard },
    { name: "Chat", path: "chat", icon: MessageCircle },
    { name: "Notifications", path: "notifications", icon: Bell },
    { name: "Profile", path: "profile", icon: User },
  ];
 
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-50 md:hidden">
      <nav className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activePage === link.path;
          return (
            <button 
              key={link.path} 
              onClick={() => onNavigate(link.path)}
              className={`flex flex-col items-center justify-center p-2 text-xs font-medium transition-colors duration-200
                ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}
              `}
            >
              <Icon size={20} />
              <span className="mt-1">{link.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation