import React from 'react';
import UserChatsList from '../Chat/UserChatsList';
import ChatWindow from '../Chat/ChatWindow';
import PostItem from '../Forum/PostItem';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
  const [recentPosts, setRecentPosts] = React.useState([]);

  React.useEffect(() => {
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

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', paddingRight: 10 }}>
        <h2>Chats</h2>
        <UserChatsList />
      </div>
      <div style={{ width: '40%', paddingLeft: 10 }}>
        <ChatWindow />
      </div>
      <div style={{ width: '30%', paddingLeft: 10 }}>
        <h2>Recent Posts</h2>
        {recentPosts.length === 0 ? (
          <p>No recent posts.</p>
        ) : (
          recentPosts.map((post) => <PostItem key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Dashboard;
