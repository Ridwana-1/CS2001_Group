import React from 'react';
import './App.css';
import Home from './Home.js';
import Navbar from './Navbar.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Transactions from './Transaction';

const App = () => {
  return (
    <Router>  
      <div>
        <Navbar /> 
        
      
            <Routes>
              <Route path="/explore" element={<Home />} />
              <Route path="/Transactions" element={<Transactions />} />
          </Routes>
        </div>
      
    </Router>
  );
};

export default App;