import React, { useState } from 'react';
import axios from 'axios';
import { Send, LogIn, Users, Shield, AlertTriangle, Settings, UserX, Check, X, Filter } from 'lucide-react';
import './Chatsystem.css';

const AdminDashboard = ({ email, room, setRoom, messages, sendMessage, joinRoom, message, setMessage }) => {
  const [showUserList, setShowUserList] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [showDisputesModal, setShowDisputesModal] = useState(false);
  const [disputeFilter, setDisputeFilter] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'
  const [loading, setLoading] = useState(false);

  // Get unique users from messages
  const uniqueUsers = [...new Set(messages.map(msg => msg.email))];

  // Fetch disputes from the API endpoint using the full URL
  const fetchDisputes = async () => {
    setLoading(true);
    try {
      console.log("Fetching disputes from API...");
      const response = await axios.get("http://localhost:5000/transactions/disputes");
      console.log("API Response:", response.data);
      
      if (response.data && response.data.disputes) {
        setDisputes(response.data.disputes.map(dispute => ({
          ...dispute,
          status: dispute.status || 'Pending' // Ensure all disputes have a status
        })));
      } else {
        console.error("Invalid response format:", response.data);
        setDisputes([]);
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
      alert("Failed to fetch disputes.");
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting a dispute
  const handleAcceptDispute = async (disputeId) => {
    try {
      console.log(`Accepting dispute with ID: ${disputeId}`);
      await axios.put(`http://localhost:5000/transactions/disputes/${disputeId}/accept`, {
        resolution: "Issue resolved to customer satisfaction",
        adminNotes: "Processed by admin"
      });
      
      // Update the dispute status locally
      setDisputes(disputes.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, status: 'Accepted' } 
          : dispute
      ));
      
      // Show success message
      alert("Dispute has been accepted successfully.");
    } catch (error) {
      console.error("Error accepting dispute:", error);
      alert("Failed to accept dispute.");
    }
  };

  // Handle rejecting a dispute
  const handleRejectDispute = async (disputeId) => {
    try {
      console.log(`Rejecting dispute with ID: ${disputeId}`);
      await axios.put(`http://localhost:5000/transactions/disputes/${disputeId}/reject`, {
        reason: "Insufficient evidence provided",
        adminNotes: "Processed by admin"
      });
      
      // Update the dispute status locally
      setDisputes(disputes.map(dispute => 
        dispute.id === disputeId 
          ? { ...dispute, status: 'Rejected' } 
          : dispute
      ));
      
      // Show success message
      alert("Dispute has been rejected.");
    } catch (error) {
      console.error("Error rejecting dispute:", error);
      alert("Failed to reject dispute.");
    }
  };

  // Admin action handler for managing disputes
  const handleManageDisputes = async () => {
    await fetchDisputes();
    setShowDisputesModal(true);
  };

  // Filter disputes based on status
  const filteredDisputes = disputes.filter(dispute => {
    if (disputeFilter === 'all') return true;
    return String(dispute.status).toLowerCase() === disputeFilter.toLowerCase();
  });

  // Render the disputes in an enhanced modal view
  const renderDisputesModal = () => (
    <div className="modal">
      <div className="disputes-modal-content">
        <div className="disputes-header">
          <h2>Dispute Management</h2>
          <button className="close-button" onClick={() => setShowDisputesModal(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="disputes-filter">
          <div className="filter-label">
            <Filter size={16} />
            <span>Filter by status:</span>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${disputeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDisputeFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${disputeFilter === 'pending' ? 'active' : ''}`}
              onClick={() => setDisputeFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${disputeFilter === 'accepted' ? 'active' : ''}`}
              onClick={() => setDisputeFilter('accepted')}
            >
              Accepted
            </button>
            <button 
              className={`filter-btn ${disputeFilter === 'rejected' ? 'active' : ''}`}
              onClick={() => setDisputeFilter('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading disputes...</div>
        ) : filteredDisputes.length === 0 ? (
          <div className="no-disputes">
            <AlertTriangle size={24} />
            <p>No disputes found with the selected filter.</p>
          </div>
        ) : (
          <div className="disputes-list">
            {filteredDisputes.map((dispute, index) => {
              // Handle status normalization and case insensitivity
              const statusLower = String(dispute.status || 'Pending').toLowerCase();
              const displayStatus = dispute.status || 'Pending';
              
              return (
                <div 
                  key={index} 
                  className={`dispute-card ${statusLower}`}
                >
                  <div className="dispute-header">
                    <div className="dispute-recipient">
                      <strong>Recipient:</strong> {dispute.recipient_email}
                    </div>
                    <div className="dispute-status">
                      {displayStatus}
                    </div>
                  </div>
                  
                  <div className="dispute-subject">
                    <strong>Subject:</strong> {dispute.subject}
                  </div>
                  
                  <div className="dispute-message">
                    <strong>Message:</strong> 
                    <p>{dispute.message}</p>
                  </div>
                  
                  <div className="dispute-timestamp">
                    <strong>Reported:</strong> {new Date(dispute.created_at).toLocaleString()}
                  </div>
                  
                  {/* Debug info - can be removed in production */}
                  <div className="dispute-debug" style={{fontSize: '10px', color: '#666'}}>
                    <p>ID: {dispute.id}</p>
                    <p>Status: {displayStatus}</p>
                  </div>
                  
                  {statusLower === 'pending' && (
                    <div className="dispute-actions">
                      <button 
                        className="action-button accept" 
                        onClick={() => handleAcceptDispute(dispute.id)}
                      >
                        <Check size={16} />
                        Accept
                      </button>
                      <button 
                        className="action-button reject" 
                        onClick={() => handleRejectDispute(dispute.id)}
                      >
                        <X size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Handle message submission with Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleUserManagement = () => {
    alert("Managing users");
  };

  const handleSystemSettings = () => {
    alert("System settings");
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <Shield className="admin-icon" />
          <h1>Administration Portal</h1>
        </div>
        <div className="header-right">
          <span className="status-dot"></span>
          <span className="admin-email">{email}</span>
          <span className="admin-badge">Administrator</span>
        </div>
      </header>

      {/* Main content area */}
      <div className="admin-content">
        {/* Left sidebar */}
        <aside className="admin-sidebar">
          <section className="room-management">
            <h2>Room Management</h2>
            <div className="room-controls">
              <input 
                type="text" 
                placeholder="Room Identifier" 
                value={room} 
                onChange={(e) => setRoom(e.target.value)} 
                className="room-input"
              />
              <button onClick={joinRoom} className="room-button">
                <LogIn size={16} />
                <span>Access Room</span>
              </button>
            </div>
          </section>

          <section className="user-management">
            <div className="section-header" onClick={() => setShowUserList(!showUserList)}>
              <h2>Active Users</h2>
              <Users size={16} />
            </div>
            {showUserList && (
              <ul className="user-list">
                {uniqueUsers.length > 0 ? (
                  uniqueUsers.map((user, index) => (
                    <li key={index} className="user-item">
                      <div className="user-status">
                        <span className="user-status-indicator"></span>
                        <span className="user-email">{user}</span>
                      </div>
                      <button className="user-action-button">
                        <UserX size={14} />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="no-users">No active users</li>
                )}
              </ul>
            )}
          </section>

          <section className="admin-actions">
            <h2>Administrative Actions</h2>
            <div className="action-buttons">
              <button onClick={handleManageDisputes} className="admin-action dispute">
                <AlertTriangle size={16} />
                <span>Manage Disputes</span>
              </button>
              <button onClick={handleUserManagement} className="admin-action users">
                <Users size={16} />
                <span>User Management</span>
              </button>
              <button onClick={handleSystemSettings} className="admin-action settings">
                <Settings size={16} />
                <span>System Settings</span>
              </button>
            </div>
          </section>

          {room && (
            <section className="current-room">
              <h3>Current Room</h3>
              <p className="room-name">{room}</p>
            </section>
          )}
        </aside>

        {/* Main chat area */}
        <main className="chat-container">
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages available. Join a room to monitor conversations.</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.email === email ? 'admin-message' : 'user-message'}`}
                  >
                    <div className="message-header">
                      <span className="sender-email">{msg.email}</span>
                      {msg.email !== email && (
                        <div className="message-actions">
                          <button className="message-action">Mute</button>
                          <button className="message-action">Flag</button>
                        </div>
                      )}
                    </div>
                    <div className="message-body">{msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="message-input-area">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="message-input"
            />
            <button 
              onClick={sendMessage}
              disabled={!message.trim()}
              className={`send-button ${!message.trim() ? 'disabled' : ''}`}
            >
              <Send size={20} />
            </button>
          </div>
        </main>

        {/* Right panel for activity log */}
        <aside className="activity-panel">
          <h2>Activity Log</h2>
          <div className="activity-list">
            <div className="activity-item critical">
              <h3>Dispute Reported</h3>
              <p>Room: General Discussion</p>
              <span className="timestamp">14:25:30</span>
            </div>
            <div className="activity-item warning">
              <h3>User Warning Issued</h3>
              <p>User: john.doe@example.com</p>
              <span className="timestamp">14:15:12</span>
            </div>
            <div className="activity-item info">
              <h3>New Room Created</h3>
              <p>Room: Technical Support</p>
              <span className="timestamp">13:52:47</span>
            </div>
          </div>
          <button className="view-all-button">View Complete Log</button>
        </aside>
      </div>

      {/* Disputes Modal */}
      {showDisputesModal && renderDisputesModal()}
    </div>
  );
};

export default AdminDashboard;