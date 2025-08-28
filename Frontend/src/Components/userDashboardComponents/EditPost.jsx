import axios from 'axios';
import React,{useState} from 'react';
import {X,ImageIcon} from 'lucide-react';

const EditPost = ({post,onClose}) => {
 const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(post.postImage);
  const [imagePreview, setImagePreview] = useState(post.postImage);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveImage = () => {
    setEditedImage(null);
    setImagePreview(null);
  };
  
  const handleSave = async(e) => {
    e.preventDefault();
    // In a real app, you would make an API call to save the changes
    const formData = new FormData();
    formData.append('title', editedTitle);
    formData.append('content', editedContent);
    if (editedImage instanceof File) {
      formData.append('postImage', editedImage);
    }
     try {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/api/v1/posts/updatePost/${post._id}`,formData,{
          headers:{
            "Content-Type":"multipart/form-data",
          },
          withCredentials: true,
        });   
     } catch (error) {
        console.error("Handlesave:: EditPost:",error);
     }

    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold">Edit Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Post Title"
              required
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="5"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Post Content"
            required
          />
          
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Post preview" className="w-full max-h-64 object-contain rounded-lg" />
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <ImageIcon size={32} className="text-gray-400 mb-2" />
                <label htmlFor="post-image-upload-edit" className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Upload Photo/Video
                </label>
                <input
                  id="post-image-upload-edit"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost