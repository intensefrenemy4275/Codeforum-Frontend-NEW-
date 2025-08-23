import React, { useState, useEffect } from 'react';
import UserChatsList from '../Chat/UserChatsList';
import ChatWindow from '../Chat/ChatWindow';
import PostItem from '../Forum/PostItem';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeChat, setActiveChat] = useState(false); 
  
  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/feed/recent_post`);
      if (!response.ok) {
        throw new Error('Failed to fetch recent posts');
      }
      const data = await response.json();
      setRecentPosts(data);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  // Called when user clicks a chat user in UserChatsList
  const handleChatOpen = () => {
    setActiveChat(true);
  };

  // Called from ChatWindow to close chat and go back to posts view
  const handleBackToPosts = () => {
    setActiveChat(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl px-4 ">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
          {!activeChat && (
            <>
              {/* Posts Section */}
              <div className="lg:flex-[2] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4">
              <h2 className="text-xl font-bold  flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Recent Posts
                </h2>
                  <hr className="my-3 border-gray-200"/>
                </div>
                
                <div className="p-6 pt-0 overflow-y-auto max-h-[calc(100%-80px)]">
                  {recentPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No recent posts yet</p>
                      <p className="text-gray-400 text-sm mt-1">Be the first to share something!</p>
                    </div>
                  ) : (
                    <div className="space-y-4 ">
                      {recentPosts.map((post) => (
                        <div key={post._id} className="transition-all duration-200 hover:scale-[1.01] postdiv">
                          <PostItem post={post} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat List Section */}
              <div className="lg:flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-6 pb-0">
                  <h2 className="text-xl font-bold  flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                      Chats
                  </h2>
                  <hr className="my-3 border-gray-200"/>

                </div>
                
                <div className="p-6 pt-0 overflow-y-auto max-h-[calc(100%-80px)]">
                  <UserChatsList onChatOpen={handleChatOpen} />
                </div>
              </div>
            </>
          )}
          
          {activeChat && (
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <ChatWindow onBack={handleBackToPosts} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;