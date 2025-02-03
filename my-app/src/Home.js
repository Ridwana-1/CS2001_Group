import React from 'react'
import Navbar from './Navbar'
import Transactions from './Transaction'
import App from './App'
import background from './Home.js'
import './Home.css'


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
    </>
  );
};

export default Home;
