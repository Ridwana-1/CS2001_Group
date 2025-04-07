import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import logo from '../assets/logo.png';
import profile from '../assets/profile.jpg';

function Navbar({ isLoggedIn, onLogout, userEmail, userRole, onLoginClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (showNotifications) setShowNotifications(false);
  };
  
  // Toggle notifications
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showDropdown) setShowDropdown(false);
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
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search items, categories, or users..."
          />
        </div>
      </div>
      
      <div className="nav-right">
        {/* Home link is always visible */}
        <Link to="/" className="nav-link">Home</Link>
        
        {/* Conditional navigation links based on login status */}
        {isLoggedIn ? (
          <>
            <Link to="/marketplace" className="nav-link">Shop</Link>
            <Link to="/listings" className="nav-link">My Listings</Link>
            <Link to="/create-listing" className="nav-link">Create Listing</Link>
            
            {/* Notifications */}
            <div className="notification-icon" onClick={toggleNotifications}>
              <span className="notification-bell">🔔</span>
              {showNotifications && (
                <div className="notifications-container">
                  <div className="notifications-box">
                    <h3 className="notifications-title">Notifications</h3>
                    <div className="notification-item">
                      <p className="notification-message">
                        <span className="notification-type">Order:</span>
                        Your order #12345 has been shipped!
                      </p>
                      <div className="notification-actions">
                        <button className="mark-read-btn">Mark as read</button>
                        <button className="dismiss-btn">Dismiss</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="profile-icon" onClick={toggleDropdown}>
              <img 
                src={`https://ui-avatars.com/api/?name=${userEmail.split('@')[0]}&background=random`} 
                alt="Profile" 
                className="avatar" 
              />
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/user-profile" className="dropdown-item">Profile</Link>
                  <Link to="/transactions" className="dropdown-item">Transactions</Link>
                  {userRole === 'admin' && (
                    <Link to="/admin" className="dropdown-item">Admin</Link>
                  )}
                  <a href="#" className="dropdown-item" onClick={onLogout}>Logout</a>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Login button for non-logged in users */}
            <button className="login-button" onClick={onLoginClick}>Login</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;