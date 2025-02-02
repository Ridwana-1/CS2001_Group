// Navbar.jsx
import React from 'react';
import logo from './Logo.jpg';
import './Navbar.css';
import './App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
 
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo"/>
        <h1 className="brand-name">SwapSaviour</h1>
      </div>
      

      <div className="nav-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input"
          />
          <span className="search-icon"></span>
        </div>
      </div>

    
      <div className="nav-right">
        <a href="/explore" className="nav-link">Explore</a>
        <a href="/messages" className="nav-link">Messages</a>
        <a href="/my-items" className="nav-link">My Items</a>
       
        </div>
      
    </nav>
  );
};

export default Navbar;