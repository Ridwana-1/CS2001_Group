import React from 'react';
import './Home.css';
import RatingsAndNotifications from './RatingsAndNotifications';

const Home = () => {
  return (
    <>
      <div className="background-image" />
      <div className="content">
        <h1 className="header">Welcome to SwapSaviour</h1>
        <p className="text">Explore and Manage Your Transactions</p>
        <div className="buttons-container">
          <button className="btn">Start Trading</button>
          <button className="btn">Learn More</button>
        </div>
      </div>
      
      {/* Ratings & Notifications Section */}
      <div className="ratings-section">
        <h2>User Ratings & Feedback</h2>
        <RatingsAndNotifications />
      </div>
    </>
  );
};

export default Home;
