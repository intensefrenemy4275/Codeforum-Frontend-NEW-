import React, { useState, useEffect } from 'react';
import UserChatsList from '../Chat/UserChatsList';
import ChatWindow from '../Chat/ChatWindow';
import PostItem from '../Forum/PostItem';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [chatActive, setChatActive] = useState(false);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/feed/recent_post`);
      if (!response.ok) throw new Error('Failed to fetch recent posts');
      const data = await response.json();
      setRecentPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const openChat = () => {
    setChatActive(true);
  };

  const closeChat = () => {
    setChatActive(false);
  };

  return (
    <div style={{
      height: '100vh',
      padding: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      {!chatActive ? (
        // POSTS VIEW - Centered posts container only
        <div style={{
          width: '60%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: 20,
          borderRadius: 8,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: 20, textAlign: 'center' }}>Recent Posts</h2>
          {recentPosts.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No recent posts.</p>
          ) : (
            recentPosts.map(post => <PostItem key={post._id} post={post} />)
          )}
        </div>
      ) : (
        // CHAT VIEW - Show chat contacts list and chat window side-by-side, filling container
        <div style={{
          display: 'flex',
          width: '80%',
          height: '80vh',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            flex: 1,
            borderRight: '1px solid #ccc',
            overflowY: 'auto',
            padding: 20,
          }}>
            <h2>Chats</h2>
            <UserChatsList onChatOpen={openChat} />
          </div>
          <div style={{ flex: 2, padding: 20, display: 'flex', flexDirection: 'column' }}>
            <ChatWindow onBack={closeChat} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
