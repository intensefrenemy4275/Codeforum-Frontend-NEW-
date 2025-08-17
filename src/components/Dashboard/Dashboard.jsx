import React, { useState, useEffect } from 'react';
import UserChatsList from '../Chat/UserChatsList';
import ChatWindow from '../Chat/ChatWindow';
import PostItem from '../Forum/PostItem';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [view, setView] = useState('home'); // "home" or "chats"

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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Navigation */}
      <nav style={{ width: 200, borderRight: '1px solid #ccc', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button onClick={() => setView('home')} style={navBtnStyle}>
          Home
        </button>
        <button onClick={() => setView('chats')} style={navBtnStyle}>
          Chats
        </button>
        {/* You can add more navigation buttons like "Create Post", "My Posts" here */}
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
        {view === 'home' && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Recent Posts</h2>
            {recentPosts.length === 0
              ? <p style={{ textAlign: 'center' }}>No recent posts.</p>
              : recentPosts.map(post => <PostItem key={post._id} post={post} highResImage />)}
          </div>
        )}
        {view === 'chats' && (
          <div style={{ display: 'flex', height: '80vh', gap: 15 }}>
            <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 15 }}>
              <h2>Chats</h2>
              <UserChatsList />
            </div>
            <div style={{ flex: 2, paddingLeft: 15 }}>
              <ChatWindow onBack={() => setView('home')} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const navBtnStyle = {
  padding: '12px',
  border: 'none',
  borderRadius: 6,
  background: '#1976d2',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer'
};

export default Dashboard;
