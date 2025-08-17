import React, { useState, useEffect } from 'react';
import UserChatsList from '../Chat/UserChatsList';
import ChatWindow from '../Chat/ChatWindow';
import PostItem from '../Forum/PostItem';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeChat, setActiveChat] = useState(false); // Tracks if chat window is open

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
    <div style={{ display: 'flex', gap: 20, height: '100vh', padding: 20 }}>
      {!activeChat && (
        <>
          {/* Show posts and chat list side-by-side */}
          <div style={{ flex: 2, overflowY: 'auto', borderRight: '1px solid #ccc', paddingRight: 10 }}>
            <h2>Recent Posts</h2>
            {recentPosts.length === 0 ? (
              <p>No recent posts.</p>
            ) : (
              recentPosts.map((post) => <PostItem key={post._id} post={post} />)
            )}
          </div>

          <div style={{ flex: 1, borderRight: '1px solid #ccc', padding: '0 10px', overflowY: 'auto' }}>
            <h2>Chats</h2>
            <UserChatsList onChatOpen={handleChatOpen} />
          </div>
        </>
      )}
      {activeChat && (
        <div style={{ flex: 1, paddingLeft: 10, display: 'flex', flexDirection: 'column' }}>
          <ChatWindow onBack={handleBackToPosts} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
