import React from 'react';
import './App.css';
import Home from './Home';
import Navbar from './Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Transactions from './Transaction';
import Notifications from './notifications';
import RatingsAndNotifications from './RatingsAndNotifications';


const App = () => {
  return (
    <Router>  
      <div>
        <Navbar /> 
        <Routes>
          <Route path="/explore" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
