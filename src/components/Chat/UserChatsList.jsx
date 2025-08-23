import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserChatsList({ onChatOpen }) {
  const { user } = useContext(AuthContext);
  const { joinChat, currentChatId } = useContext(ChatContext);
  const [mutualUsers, setMutualUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMutualUsers() {
      if (user) {
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${API_URL}/chat/mutual-followers`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setMutualUsers(data.mutualFollowers);
          }
        } catch (error) {
          console.error('Error fetching mutual users:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchMutualUsers();
  }, [user]);

  const handleStartChat = (otherUser) => {
    if (user) {
      joinChat(user._id, otherUser._id,otherUser);
      if (typeof onChatOpen === 'function') {
        onChatOpen();
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
       No chats found !!
      </div>
    );
  }

  if (mutualUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium mb-1">No chat contacts found</p>
        <p className="text-gray-400 text-sm">Start following people to see them here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {mutualUsers.map((u) => {
        const isActive = false;
        return (
          <div
            key={u._id}
            onClick={() => handleStartChat(u)}
            className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
              isActive
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md'
                : 'hover:bg-gradient-to-r from-blue-50 to-purple-50 hover:border-2 hover:border-blue-200 hover:shadow-md'
            }`}
          >
            {/* Profile Picture */}
            <div className="relative mr-3">
              <img
                src={u.profilePic || '/default-avatar.png'}
                alt={u.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6366f1&color=fff&size=48`;
                }}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold text-sm truncate ${
                  isActive ? 'text-blue-700' : 'text-gray-800'
                }`}>
                  {u.name}
                </h4>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <p className={`text-xs truncate ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                @{u.username}
              </p>
              {/* <div className="flex items-center mt-1">
                <div className="w-1 h-1 bg-green-400 rounded-full mr-1"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div> */}
            </div>

            {/* Chat Icon */}
            <div className={`ml-2 p-2 rounded-full transition-colors duration-200 ${
              isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}