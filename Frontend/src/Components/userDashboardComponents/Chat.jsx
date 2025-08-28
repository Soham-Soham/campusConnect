import {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {MessageCircle,ArrowLeft,Send,Search} from 'lucide-react';
import axios from "axios";
import { socket } from '../../socket';

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [conversations,setConversations] = useState([])

  const [search,setSearch] = useState("");
  const [searchResult,setSearchResult] = useState([]);
 
  const [messages,setMessage] = useState([]);
  const [newMessage,setNewMessage] = useState("");

  const {user} = useSelector(state=>state.auth);

  // socket Setup
  useEffect(()=>{
    socket.emit("setup",user);
    socket.on("connected",()=> console.log("Socket conencted"));

    socket.on("message received",(message)=>{
      if(activeChat && message.chat._id === activeChat._id){
        setMessage((prev)=>[...prev,message])
      }
    });

    fetchConversation();
    return ()=>{socket.off("message received")};
  },[activeChat])

  useEffect(()=>{
    handleSearch();
  },[search])

  // search users
  const handleSearch = async()=>{
    if(search.trim() == "") return setSearchResult("");
    const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/users/getAllUsers?search=${search}`,{withCredentials: true});
    setSearchResult(data);
    console.log(data.length);
  };

  //Access chat
  const accessChat = async(userId)=>{
    const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/chats`,{userId},{withCredentials: true});
    activeChat(data);
    socket.emit("join chat",data._id);

    //load message
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/messages/${data._id}`,{withCredentials: true});
    setMessage(res.data);
  };

  //send message
  const sendMessage = async()=>{
    if(!newMessage.trim()) return;

    const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/messages`,{content:newMessage, chatId: activeChat._id},{withCredentials: true});
    socket.emit("new message",data);
    setMessage([...messages,data]);
    setNewMessage("");
  };

  //load messages
  const openChat = async(chat)=>{
    setActiveChat(chat);
    socket.emit("join chat",chat._id);
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/messages/${chat._id}`,{withCredentials: true});
    setMessage(res.data);
    // console.log(res.data);
  }

  //fetch converstaion
  const fetchConversation = async()=>{
    const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/chats`,{withCredentials: true});
    // console.log(data);
    setConversations(data);
  }

  return (
    <div className="bg-white rounded-xl shadow-md min-h-[calc(100vh-12rem)] flex flex-col md:flex-row gap-10 ">
      {/* Conversation List */}
      <div className={`${activeChat ? 'hidden' : 'block'} md:block w-full md:w-1/3 border-r border-gray-200 p-4`}>
        <h2 className="text-2xl font-bold mb-4">Chats</h2>
        {/* --- Search Bar is added here --- */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {
          searchResult.length > 0 ? (
            searchResult.map(user => (
              <div 
                key={user._id} 
                onClick={() => accessChat(user._id)} 
                className="flex bg-emerald-500 items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <img src={user.profilePicture} alt="Avatar" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">Search Result</p>
                </div>
              </div>
            ))
          ):(<></>)
        }
        {/* --- End of Search Bar --- */}
        <div className="space-y-2">
          {conversations.map(chat => (
            <div 
              key={chat._id} 
              onClick={() => openChat(chat)} 
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                ${activeChat && activeChat._id === chat._id ? 'bg-gray-200' : 'hover:bg-gray-100'}
              `}
            >
              <img src={chat.members.filter((member)=> member._id !== user._id).map((member)=>member.profilePicture)} alt="Avatar" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-gray-900">{chat.members.filter((member)=> member._id !== user._id).map((member)=>member.name)}</p>
                <p className="text-sm text-gray-500 truncate">{chat.latestMessage?.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`${activeChat ? 'flex' : 'hidden'} md:flex flex-col h-[80vh] w-auto`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
              <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-gray-600 hover:text-gray-800 mr-2">
                <ArrowLeft size={20} />
              </button>
              <img src={activeChat.members.filter((member)=> member._id !== user._id).map((member)=>member.profilePicture)} alt="Avatar" className="w-12 h-12 rounded-full" />
              <div className="ml-4">
                <p className="font-semibold text-gray-900">{activeChat.members.filter((member)=> member._id !== user._id).map((member)=>member.name)}</p>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>
            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
              {messages.map(msg => (
                <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 flex items-center">
              <input type="text" value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border rounded-full focus:outline-none" />
              <button onClick={sendMessage} className="ml-3 p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 p-8">
            <MessageCircle size={64} className="mb-4" />
            <p className="text-lg">Select a chat to start a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat