import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function UserChatsList({ onChatOpen }) {
  const { user } = useContext(AuthContext);
  const { joinChat, currentChatId } = useContext(ChatContext);
  const [mutualUsers, setMutualUsers] = useState([]);

  useEffect(() => {
    async function fetchMutualUsers() {
      if (user) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/chat/mutual-followers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMutualUsers(data.mutualFollowers);
        }
      }
    }
    fetchMutualUsers();
  }, [user]);

  const handleStartChat = (otherUser) => {
    if (user) {
      joinChat(user._id, otherUser._id);
      if (typeof onChatOpen === 'function') {
        onChatOpen();  // Notify Dashboard to show chat window in fullscreen mode
      }
    }
  };

  return (
    <div className="user-chats-list">
      {mutualUsers.length === 0 && <p>No chat contacts found.</p>}
      <ul>
        {mutualUsers.map((u) => (
          <li
            key={u._id}
            style={{ fontWeight: currentChatId?.includes(u._id) ? 'bold' : 'normal', cursor: 'pointer' }}
            onClick={() => handleStartChat(u)}
          >
            {u.username} ({u.name})
          </li>
        ))}
      </ul>
    </div>
  );
}
