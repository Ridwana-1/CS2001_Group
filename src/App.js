import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './Components/Navbar.js';
import Home from './pages/Home/Home.js';
import Transactions from './pages/Transactions/Transaction.jsx';
import UserProfile from './pages/UserProfile/UserProfile';  // Import UserProfile
import Receipt from './pages/Transactions/Reciept.jsx';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route index element ={<Home />}></Route>
          <Route path="/explore" element={ null } />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/user-profile" element={<UserProfile />} /> {/* Add Route for UserProfile */}
         
        </Routes>
      </div>
    </Router>
  );
}

export default App;

