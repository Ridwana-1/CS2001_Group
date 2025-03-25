import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="App">
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
          <Link to="/marketplace" className="btn">
            Shop
          </Link>
          <Link to="/listings" className="btn">
            Current Listings
          </Link>
          <Link to="/create-listing" className="btn">
            Create Listing
          </Link>
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
