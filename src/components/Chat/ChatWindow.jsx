import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';

export default function ChatWindow({ onBack }) {
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
    if (!newMessage.trim() || !currentChatId) return;

    const otherUserId = currentChatId
      .split('_')
      .find((id) => id !== user._id);

    sendMessage(user._id, otherUserId, newMessage.trim());
    setNewMessage('');
  };

  if (!currentChatId) {
    return <div className="chat-window">Select a chat to start messaging.</div>;
  }

  return (
    <div className="chat-window" style={{ border: '1px solid #ccc', padding: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <button onClick={onBack} style={{ marginBottom: 10, alignSelf: 'flex-start' }}>
        ← Back to Posts
      </button>
      <div className="messages" style={{ flexGrow: 1, overflowY: 'auto', marginBottom: 10 }}>
        {messages.length === 0 && <p>No messages yet. Start the conversation!</p>}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.from === user._id ? 'right' : 'left',
              marginBottom: 5,
              padding: '4px 8px',
              borderRadius: 8,
              backgroundColor: msg.from === user._id ? '#dcf8c6' : '#f1f0f0',
              maxWidth: '80%',
              alignSelf: msg.from === user._id ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.text || msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ flexGrow: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4 }}>
          Send
        </button>
      </form>
    </div>
  );
}
