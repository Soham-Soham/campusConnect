import React, { useState } from "react";
import { PlusCircle, Image as ImageIcon, X, Send, CheckCircle, XCircle } from 'lucide-react';
import axios from "axios";
import {useSelector} from 'react-redux';

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Simulated user data, as Redux is not available here
  const {user} = useSelector((state)=>state.auth) 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
    if (file) {
      setPostImagePreview(URL.createObjectURL(file));
    } else {
      setPostImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Title and content are required.' });
      return;
    }

    // In a real app, you would create a FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (postImage) {
      formData.append("postImage", postImage);
    }

    try {
      setLoading(true);
      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/createPost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
      // Simulating a successful response
      setMessage({ type: 'success', text: 'Post created successfully!' });
      setTitle("");
      setContent("");
      setPostImage(null);
      setPostImagePreview(null);
    } catch (error) {
      console.error("Error creating post", error);
      setMessage({ type: 'error', text: "Failed to create post. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
        <PlusCircle size={24} /> Create New Post
      </h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post Title */}
        <div>
          <label htmlFor="post-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            placeholder="Enter a title for your post"
            required
          />
        </div>
        
        {/* Post Content */}
        <div>
          <label htmlFor="post-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
            placeholder={`What's on your mind, ${user?.name || 'user'}?`}
            required
          ></textarea>
        </div>

        {/* Post Image Preview and Upload */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {postImagePreview ? (
            <div className="relative">
              <img src={postImagePreview} alt="Post preview" className="w-full max-h-64 object-cover rounded-lg" />
              <button 
                type="button" 
                onClick={() => { setPostImage(null); setPostImagePreview(null); }}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <ImageIcon size={32} className="text-gray-400 mb-2" />
              <label 
                htmlFor="post-image-upload" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
              >
                Upload Photo/Video
              </label>
              <input
                id="post-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
