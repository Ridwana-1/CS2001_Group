import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Using Link for navigation
import logo from '../assets/logo.png';
import profile from '../assets/profile.jpg';
import './Navbar.css';

function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
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
}

export default Navbar;
