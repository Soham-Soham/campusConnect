import {UserPlus,LayoutDashboard} from 'lucide-react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

const Profile = () => {
  const [myposts,setMyposts] = useState([])

   useEffect(()=>{
    const getMyPosts = async()=>{
     try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/myPosts`,{withCredentials: true});
      console.log(res);
      setMyposts(res.data)
      
     } catch (error) {
      console.error("getMyPosts::frontend:",error);
     }
  }
  getMyPosts()
  },[])

  const {user} = useSelector((state)=>state.auth)
  // console.log(user);
  
  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="relative">
        <img 
          src="https://picsum.photos/800/300"
          alt="Cover photo"
          className="w-full h-40 object-cover rounded-t-xl"
        /> 
        <img
          src={user.profilePicture}
          alt="User Avatar"
          className="absolute -bottom-16 left-8 h-32 w-32 rounded-full border-4 border-white object-cover"
        />
      </div>
      <div className="p-8 pt-20">
        <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
        <p className="text-gray-500">@{user.name.replaceAll(' ','')}</p>
        <p className="mt-4 text-gray-700">Student at Campus University. Passionate about coding, design, and connecting with the community. #TechEnthusiast</p>
        <div className="flex items-center space-x-4 mt-4 text-gray-500">
          <div className="flex items-center space-x-1">
            <UserPlus size={16} />
            <span className="text-sm">1.2K Followers</span>
          </div>
          <div className="flex items-center space-x-1">
            <LayoutDashboard size={16} />
            <span className="text-sm">{myposts.length} Posts</span>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-bold border-b pb-2 mb-4">Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {myposts.map((post,index) => (
              <img key={index} src={post.postImage} alt={`Post ${post.id}`} className="w-full h-36 object-cover rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;