import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Using Link for navigation
import logo from '../assets/logo.png';
import profile from '../assets/profile.jpg';
import './Navbar.css';

function Navbar() {
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
        {/* Wrap in a Link but prevent text highlighting issues */}
        <Link to="/" className="nav-home-link">
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
        <a href="/explore" className="nav-link">Explore</a>
        <a href="/messages" className="nav-link">Messages</a>
        <a href="/transactions" className="nav-link">Transactions</a>

        <div className="profile-icon" onClick={toggleDropdown}>
          <img src={profile} alt="Profile" className="avatar" />
          <img src={profile} alt="Profile" className="avatar" />
        </div>

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
}

export default Navbar;
