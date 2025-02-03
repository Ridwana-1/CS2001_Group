import React, { useState } from 'react';
import logo from './logo.png';
import './Navbar.css';
import profile from './profile.jpg'; 

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="brand-name">SwapSaviour</h1>
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

        {/* Profile icon with dropdown */}
        <div className="profile-icon" onClick={toggleDropdown}>
          <img src={profile} alt="Profile" className="avatar" /> 
        </div>

   
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <a href="/profile" className="dropdown-item">Profile</a>
            <a href="/settings" className="dropdown-item">Settings</a>
            <a href="/logout" className="dropdown-item">Logout</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
