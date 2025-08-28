import {ImageIcon} from 'lucide-react';
import {PostCard} from './index.js';
import { useState,useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts,setPosts] = useState([]);

   useEffect(()=>{
    const allPosts = async()=>{
     try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/allPosts`,{withCredentials: true});
      // console.log(res);
      setPosts(res.data.data);  
     } catch (error) {
      console.error("getMyPosts::frontend:",error);
     }
  }
  allPosts();
  },[posts])

  return (
    <div className="space-y-6">
      
      {posts.map((post,index) => (
        <PostCard key={index} post={post} />
      ))}
    </div>
  );
};

export default Posts;