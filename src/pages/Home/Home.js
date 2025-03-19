import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar.js';
import Transactions from '../Transactions/Transaction.jsx';
import background from '../../assets/Home.jpg';
import './Home.css';

const Home = () => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a new notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  // Function to remove a notification
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  useEffect(() => {
    // Example: Add a welcome notification on page load
    addNotification('Welcome to SwapSaviour!', 'success');
  }, []);

  return (
    <>
      <div className="background-image" style={{ backgroundImage: `url(${background})` }} />
      <div className="content">
        <h1 className="header">Welcome to SwapSaviour</h1>
        <p className="text">Explore and Manage Your Transactions</p>
        <div className="buttons-container">
          <button className="btn">Start Trading</button>
          <button className="btn">Learn More</button>
        </div>
      </div>
      
      {/* Notifications Container */}
      <div className="notifications-container">
        {notifications.map(({ id, message, type }) => (
          <div key={id} className={`notification ${type}`}>
            {message}
            <button className="close-btn" onClick={() => removeNotification(id)}>×</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
