import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ isLoggedIn, userEmail, userRole, onLoginClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Decide where to link based on login status
  const getLink = (path) => {
    if (isLoggedIn) {
      return path;
    }
    return "#";
  };
  
  // Handle button click based on login status
  const handleButtonClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      onLoginClick();
    }
  };
  
  return (
    <div className="App home-page">
      <div className="background-image" />
      
      <div className={`content ${isLoaded ? 'animate-slide-up' : ''}`}>
        <h1 className={`header ${isLoaded ? 'animate-fade-in' : ''}`}>
          Swap Saviour
        </h1>
        
        <p className={`text ${isLoaded ? 'animate-fade-in' : ''}`}>
          Connect with local food sellers, discover fresh produce, 
          and support your community marketplace. 
          Trade, buy, and sell fresh foods directly from local producers.
        </p>
        
        <div className={`buttons-container ${isLoaded ? 'animate-slide-up' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link to="/marketplace" className="btn">
                Shop
              </Link>
              <Link to="/listings" className="btn">
                Current Listings
              </Link>
              <Link to="/create-listing" className="btn">
                Create Listing
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="#" 
                className="btn" 
                onClick={(e) => {
                  e.preventDefault();
                  onLoginClick();
                }}
              >
                Get Started
              </Link>
              <Link 
                to="#" 
                className="btn" 
                onClick={(e) => {
                  e.preventDefault();
                  onLoginClick();
                }}
              >
                Shop
              </Link>
              <Link 
                to="#" 
                className="btn" 
                onClick={(e) => {
                  e.preventDefault();
                  onLoginClick();
                }}
              >
                Current Listings
              </Link>
              <Link 
                to="#" 
                className="btn" 
                onClick={(e) => {
                  e.preventDefault();
                  onLoginClick();
                }}
              >
                Create Listing
              </Link>
            </>
          )}
        </div>
      </div>
      
      <footer className="footer">
        <h3>Why Swap Saviour?</h3>
        <div className="footer-features">
          <div>
            <h4>Local Produce</h4>
            <p>Direct connection with local community and charities</p>
          </div>
          <div>
            <h4>Fair Trade</h4>
            <p>Transparent pricing and fair compensation</p>
          </div>
          <div>
            <h4>Community Support</h4>
            <p>Strengthen local food ecosystems</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;