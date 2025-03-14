import React from 'react';
import background from '../../assets/Home.jpg'; 


const Home = () => {
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
    </>
  );
};

export default Home;
