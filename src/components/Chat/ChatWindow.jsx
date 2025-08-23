import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { Link } from 'react-router-dom';

export default function ChatWindow({ onBack }) {
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, currentChatId, otherUser } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef();

  useEffect(() => {
    if (messagesEndRef.current) {
      // messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChatId) return;

    const otherUserId = currentChatId
      .split('_')
      .find((id) => id !== user._id);

    sendMessage(user._id, otherUserId, newMessage.trim());
    setNewMessage('');
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    
    if (msgDate.getTime() === todayDate.getTime()) {
      return 'Today';
    } else if (msgDate.getTime() === yesterdayDate.getTime()) {
      return 'Yesterday';
    } else if (today - messageDate < 7 * 24 * 60 * 60 * 1000) {

      return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
    } else if (messageDate.getFullYear() === today.getFullYear()) {

      return messageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } else {

      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  // Helper function to format time
  const formatTime = (date) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const shouldShowDateSeparator = (currentMsg, prevMsg, index) => {
    if (index === 0) return true;
    
    const currentDate = new Date(currentMsg.timestamp || currentMsg.createdAt || new Date());
    const prevDate = new Date(prevMsg.timestamp || prevMsg.createdAt || new Date());
    
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const prevDateOnly = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate());
    
    return currentDateOnly.getTime() !== prevDateOnly.getTime();
  };

  if (!currentChatId) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center">
          <button 
            onClick={onBack} 
            className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 className="text-lg font-semibold text-white">Chat</h3>
        </div>
        
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Chat Selected</h3>
            <p className="text-gray-500">Choose a conversation from your contacts to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center shadow-lg">
        <button 
          onClick={onBack} 
          className="mr-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-200 "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="flex items-center">
          <img className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3" src={otherUser.profilePic}/>
          <Link to={`/profile/${otherUser.username}`} >
            <h3 className="text-lg font-semibold ">{otherUser.name}</h3>
          </Link>
        </div>
      </div>
      <hr className="border-black-200"/>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Start the conversation!</p>
            <p className="text-gray-400 text-sm mt-1">Send a message to get things rolling</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <React.Fragment key={idx}>
              {/* Date Separator */}
              {shouldShowDateSeparator(msg, messages[idx - 1], idx) && (
                <div className="flex justify-center my-4">
                  <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-200">
                    <span className="text-xs font-medium text-gray-600">
                      {formatDate(msg.timestamp || msg.createdAt || new Date())}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Message */}
              <div className={`flex ${msg.from === user._id ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    msg.from === user._id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text || msg}</p>
                  <div className={`text-xs mt-1 ${
                    msg.from === user._id ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp || msg.createdAt || new Date())}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}