import {Heart,MessageSquare,UserPlus} from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, type: 'like', message: 'Jane Smith liked your post.', time: '10 min ago', icon: Heart, color: 'text-red-500' },
    { id: 2, type: 'comment', message: 'Dr. Evans commented on your post.', time: '1 hour ago', icon: MessageSquare, color: 'text-blue-500' },
    { id: 3, type: 'connect', message: 'Alice Brown sent you a connection request.', time: '2 hours ago', icon: UserPlus, color: 'text-green-500' },
  ];
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <ul className="divide-y divide-gray-200">
        {notifications.map(notif => {
          const Icon = notif.icon;
          return ( 
            <li key={notif.id} className="py-4 flex items-start space-x-4">
              <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100 ${notif.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{notif.message}</p>
                <p className="text-sm text-gray-500">{notif.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Notifications