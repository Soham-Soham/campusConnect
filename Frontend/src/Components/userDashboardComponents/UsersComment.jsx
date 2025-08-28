import React,{useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { MoreHorizontal,MoreVertical } from "lucide-react";
import axios from "axios";

const UsersComment = ({ comment, postId}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const {user} = useSelector(state=>state.auth);
  
  useEffect(()=>{
    // console.log("comment",comment);
  },[]);

  const handleSaveEdit = async() => {
    if (editedText.trim()) {
      try {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/updateComment/${comment._id}`,{content:editedText},{withCredentials:true});
      } catch (error) {
        console.error("handleSaveEdit::UserComment:",error);
      }
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(comment.content);
    setIsEditing(false);
  };

  const handleDelete = async() => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/v1/comments/deleteComment/${comment._id}`,{withCredentials:true});
      } catch (error) {
        console.error("handleDelete::UserComment:",error);
      }
    }
  };
  
  return (
    <div className="flex items-start space-x-3 group relative">
      <img src={comment.commentedBy.profilePicture} alt="Avatar" className="w-8 h-8 rounded-full" />
      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="flex-1 px-2 py-1 rounded-md border border-gray-300 focus:outline-none"
            />
            <button onClick={handleSaveEdit} className="text-blue-500 text-sm">Save</button>
            <button onClick={handleCancelEdit} className="text-gray-500 text-sm">Cancel</button>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-sm">{comment.commentedBy.name}</p>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
        )}
      </div>
      {comment.commentedBy._id === user._id && (
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="absolute top-0 right-6 z-10 w-24 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={() => { setIsEditing(true); setShowMenu(false); }}
                className="w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-3 py-1 text-sm text-red-500 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersComment;