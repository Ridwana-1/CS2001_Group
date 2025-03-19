import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';  // Update your logo path
import './Navbar.css';
import profile from '../assets/profile.jpg'; // Update your profile picture path

// Notifications Component
const Notifications = ({ notifications, handleMarkAsRead, handleDismissNotification }) => {
  return (
    <div className="notifications-container">
      <div className="notifications-box">
        <h3 className="notifications-title">Notifications</h3>
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p>No notifications at the moment.</p>
          ) : (
            notifications.map(notification => (
              <div key={notification.id} className={`notification-item ${notification.read ? 'read' : ''}`}>
                <div className="notification-message">
                  <span className="notification-type">
                    {notification.type === 'transaction' && 'Transaction Alert:'}
                    {notification.type === 'itemAvailability' && 'Item Availability:'}
                    {notification.type === 'eventReminder' && 'Event Reminder:'}
                  </span>
                  {notification.message}
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button className="mark-read-btn" onClick={() => handleMarkAsRead(notification.id)}>
                      Mark as Read
                    </button>
                  )}
                  <button className="dismiss-btn" onClick={() => handleDismissNotification(notification.id)}>
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsVisible, setNotificationsVisible] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'transaction', message: 'You have a new message regarding your recent transaction.', read: false },
    { id: 2, type: 'itemAvailability', message: 'An item you were looking for is now available.', read: false },
    { id: 3, type: 'eventReminder', message: 'Don\'t forget your upcoming event tomorrow.', read: false },
  ]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleNotifications = () => {
    setNotificationsVisible(!isNotificationsVisible);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDismissNotification = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-container">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="brand-name">SwapSaviour</h1>
        </Link>
      </div>

      <div className="nav-center">
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
          <span className="search-icon"></span>
        </div>
      </div>

      <div className="nav-right">
        <Link to="/explore" className="nav-link">Explore</Link>
        <Link to="/messages" className="nav-link">Messages</Link>
        <Link to="/transactions" className="nav-link">Transactions</Link>

        {/* Notifications Button */}
        <div className="notification-icon" onClick={toggleNotifications}>
          <span className="notification-bell">&#128276;</span>
        </div>

        {/* Show Notifications if visible */}
        {isNotificationsVisible && (
          <Notifications
            notifications={notifications}
            handleMarkAsRead={handleMarkAsRead}
            handleDismissNotification={handleDismissNotification}
          />
        )}

        {/* Profile Icon */}
        <div className="profile-icon" onClick={toggleDropdown}>
          <img src={profile} alt="Profile" className="avatar" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/user-profile" className="dropdown-item">Profile</Link>
            <Link to="/settings" className="dropdown-item">Settings</Link>
            <Link to="/logout" className="dropdown-item">Logout</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
