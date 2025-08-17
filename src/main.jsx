import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthContext } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

function Root() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current authenticated user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/get-user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ChatProvider token={localStorage.getItem('token')}>
        <App />
      </ChatProvider>
    </AuthContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
