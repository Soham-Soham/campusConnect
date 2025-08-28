import {MoreVertical,Heart,MessageSquare,Share2,Send} from 'lucide-react';
import {formatDistanceToNow} from 'date-fns';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {EditPost, UsersComment} from './index.js';

const PostCard = ({ post }) => {
  const {user} = useSelector((state)=>state.auth);
  const [postTime,setPostTime] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing,setIsEditing] = useState(false);
  const [likes,setLikes] = useState(post.likes.length);
  const [isLiked,setIsLiked] = useState(()=>post.likes.some(like => like.likedBy._id === user._id))
  const [showComments,setShowComments] = useState(false);
  const [newComment,setNewComment] = useState('');
  
  useEffect(()=>{
    // console.log(post);
    
    const updateTime = ()=>{
      setPostTime(
        formatDistanceToNow(new Date(post.createdAt),{addSuffix:true})
      );
    }

    updateTime();
    const intervalId = setInterval(updateTime,60000);

    return ()=> clearInterval(intervalId)
    
  },[])


  const handleEditPost = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDeletePost = async() => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      alert(`Deleting post ${post._id}`);
    }
    try {
      const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/deletePost/${post._id}`,{withCredentials:true})
    } catch (error) {
     console.error("HandleDeletePost::",error);
    }
    setShowMenu(false);
  };

  const handleCloseEdit = ()=>{
    setIsEditing(false);
  }

  const handleLike = async()=>{
    try {
    if(isLiked){
        await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/likes/unlikePost`,{postId:post._id},{withCredentials:true});
        setLikes(prev => prev-1);
        setIsLiked(false);
      }else{
        await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/likes/likePost`,{postId:post._id},{withCredentials:true});
        setLikes(prev => prev+1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("handleLike:",error);
    }
  }

  const handlePostComment = async()=>{
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/createComment`,{postId:post._id,content:newComment},{withCredentials:true});
      setNewComment('');
    } catch (error) {
      console.error("handlePostComment::error:",error);
    }
  }

  return (
    <>
    {
      isEditing && (
        <EditPost post={post} onClose={handleCloseEdit}/>
      )
    }
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={post.owner.profilePicture} alt="Avatar" className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-semibold text-gray-900">{post.owner.name}</p>
            <p className="text-sm text-gray-500">{postTime}</p>
          </div>
        </div>
        {
          post.owner._id == user._id && (
            <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute top-8 right-0 z-10 w-32 bg-white rounded-md shadow-lg py-1">
                <button
                  onClick={handleEditPost}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeletePost}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          )
        }
      </div>
      <p className=' text-black text-xl  font-semibold'>{post.title}</p> 
      <p className="text-gray-700 mb-4">{post.content}</p>
      {post.postImage && (
        <img src={post.postImage} alt="Post image" className="w-full h-auto rounded-lg object-contain mb-4" />
      )}
      <div className="flex items-center justify-between text-gray-500 border-t border-gray-200 pt-4">
        <div className="flex space-x-4">
          <button onClick={handleLike} className={`flex items-center space-x-1 ${isLiked ? "text-red-500":"hover:text-red-500"} transition-colors`}>
            <Heart size={20} fill={isLiked? 'currentColor':'none'} />
            <span>{likes}</span>
          </button>
          <button onClick={()=>setShowComments(!showComments)} className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
            <MessageSquare size={20} />
            <span>{post.comments.length}</span>
          </button>
        </div>
        <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
          <Share2 size={20} />
          <span>Share</span>
        </button>
      </div>

       {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Displaying comments with a max height and overflow for scrolling */}
            <div className="max-h-40 overflow-y-auto space-y-3">
              {post.comments.map(comment => (
                <UsersComment key={comment._id} comment={comment} postId={post._id} />
              ))}
            </div>
            
            {/* New Comment Input */}
            <div className="flex items-center space-x-2">
              <input 
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handlePostComment}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
    </div>
    </>
  );
};

export default PostCard;