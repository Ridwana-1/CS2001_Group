import React, { useState } from 'react';
import { Send, LogIn, Users } from 'lucide-react';
import './Chatsystem.css';

const UserDashboard = ({ email, room, setRoom, messages, sendMessage, joinRoom, message, setMessage }) => {
  const [showUserList, setShowUserList] = useState(false);

  // Get unique users from messages
  const uniqueUsers = [...new Set(messages.map((msg) => msg.email))];

  // Handle message submission with Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-container">
          <h2 className="dashboard-title">User Dashboard</h2>
          <div className="user-indicator">
            <span className="status-dot"></span>
            <p className="user-email">{email}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="room-join-section">
            <h3 className="section-title">Join a Room</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter room name"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="room-input"
              />
            </div>
            <button onClick={joinRoom} className="join-button">
              <LogIn size={16} />
              <span>Join Room</span>
            </button>
          </div>

          {/* Users List Section */}
          <div className="users-section">
            <div className="section-header" onClick={() => setShowUserList(!showUserList)}>
              <h3 className="section-title">Active Users</h3>
              <Users size={16} />
            </div>
            {showUserList && (
              <div className="user-list">
                {uniqueUsers.map((user, index) => (
                  <div key={index} className="user-item">
                    <span className="status-dot"></span>
                    <span className="user-name">{user}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Room Info */}
          {room && (
            <div className="room-info">
              <p className="room-label">CURRENT ROOM</p>
              <p className="room-name">{room}</p>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p className="empty-message">No messages yet. Join a room to start chatting!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-bubble ${msg.email === email ? 'sent' : 'received'}`}
                >
                  <p className="message-sender">{msg.email}</p>
                  <p className="message-content">{msg.message}</p>
                  {/* Optionally, include a timestamp element here as .message-time */}
                </div>
              ))
            )}
          </div>

          {/* Message Input Area */}
          <div className="message-input-area">
            <form className="message-form" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className={`send-button ${message.trim() ? 'active' : 'disabled'}`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
