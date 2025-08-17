import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';

export default function ChatWindow() {
  const { user } = useContext(AuthContext);
  const { messages, sendMessage, currentChatId } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const otherUserId = currentChatId
      ?.split('_')
      .find((id) => id !== user._id);
    sendMessage(user._id, otherUserId, newMessage.trim());
    setNewMessage('');
  };

  if (!currentChatId) {
    return <div className="chat-window">Select a chat to start messaging.</div>;
  }

  return (
    <div className="chat-window" style={{ border: '1px solid #ccc', padding: 10 }}>
      <div className="messages" style={{ height: 300, overflowY: 'auto', marginBottom: 10 }}>
        {messages.length === 0 && <p>No messages yet. Start the conversation!</p>}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.from === user._id ? 'right' : 'left',
              marginBottom: 5,
            }}
          >
            <b>{msg.from === user._id ? 'Me' : 'Them'}: </b>
            {msg.text || msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ width: '80%' }}
        />
        <button type="submit" style={{ width: '18%', marginLeft: '2%' }}>
          Send
        </button>
      </form>
    </div>
  );
}
