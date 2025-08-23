import React, { createContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const ChatProvider = ({ children, token }) => {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherUser , setOtherUser] = useState({});
  const socket = useRef(null);

  // Initialize socket with auth token for backend validation
  useEffect(() => {
    if (token) {
      socket.current = io(SOCKET_SERVER_URL, {
        auth: {
          token: `Bearer ${token}`,
        },
        transports: ['websocket'],
      });

      // Listen for chat history received
      socket.current.on('chatHistory', (msgs) => {
        setMessages(msgs);
      });

      // Listen for new incoming chat messages
      socket.current.on('chatMessage', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Handle denied chat attempts
      socket.current.on('chatDenied', (msg) => {
        alert(msg);
        setCurrentChatId(null);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [token]);

  // Function to join a chat room (with two user IDs)
  const joinChat = (currentUserId, otherUserId,otherUser) => {
    setOtherUser(otherUser);
    if (socket.current && currentUserId && otherUserId) {
      setMessages([]);
      const roomId = [currentUserId, otherUserId].sort().join('_');
      setCurrentChatId(roomId);
      socket.current.emit('joinRoom', { currentUserId, otherUserId });
    }
  };

  // Function to send a chat message
  const sendMessage = (from, to, text) => {
    if (socket.current && currentChatId) {
      socket.current.emit('chatMessage', {
        roomId: currentChatId,
        from,
        to,
        text,
      });
    }
  };

  return (
    <ChatContext.Provider value={{ currentChatId, messages,otherUser, joinChat, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
