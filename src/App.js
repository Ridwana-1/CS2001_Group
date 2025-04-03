import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './Components/Navbar.js';
import HomePage from './pages/Home/Home.js';
import Transactions from './pages/Transactions/Transaction.jsx';
import UserProfile from './pages/UserProfile/UserProfile';
import ReceiptPage from './pages/Transactions/ReceiptPage.jsx';
import DisputeForm from './pages/Transactions/DisputeForm.jsx';
import ChatSystem from './pages/Transactions/ChatSystem.jsx';
import LoginBox from './LoginBox';

function App() {
  // Global state for authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Function to handle successful login
  const handleLogin = (email, role) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(role);
    setShowLoginModal(false);
  };
  
  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserRole('');
  };

  // Function to handle protected routes
  const handleProtectedAction = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };
  
  return (
    <Router>
      <div className="app-container">
        {/* Navbar with authentication state */}
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout}
          userEmail={userEmail}
          userRole={userRole}
          onLoginClick={() => setShowLoginModal(true)}
        />
        
        {/* Improved login modal using createPortal */}
        {showLoginModal && (
          <LoginBox 
            onLogin={handleLogin} 
            onClose={() => setShowLoginModal(false)} 
          />
        )}
        
        <Routes>
          {/* Home is accessible to everyone */}
          <Route 
            path="/" 
            element={
              <HomePage 
                isLoggedIn={isLoggedIn} 
                userEmail={userEmail} 
                userRole={userRole} 
                onLoginClick={() => setShowLoginModal(true)}
              />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/marketplace" 
            element={
              isLoggedIn ? (
                <div>Marketplace Page</div>
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          <Route 
            path="/listings" 
            element={
              isLoggedIn ? (
                <div>Current Listings Page</div>
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          <Route 
            path="/create-listing" 
            element={
              isLoggedIn ? (
                <div>Create Listing Page</div>
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          <Route 
            path="/transactions" 
            element={
              isLoggedIn ? (
                <Transactions />
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          <Route 
            path="/user-profile" 
            element={
              isLoggedIn ? (
                <UserProfile userEmail={userEmail} userRole={userRole} />
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          <Route 
            path="/receipt/:orderId" 
            element={
              isLoggedIn ? (
                <ReceiptPage />
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          <Route 
            path="/dispute-order" 
            element={
              isLoggedIn ? (
                <DisputeForm />
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          <Route 
            path="/chatroom" 
            element={
              isLoggedIn ? (
                <ChatSystem />
              ) : (
                <Navigate to="/" state={{ showLogin: true }} />
              )
            } 
          />
          
          {/* Login path */}
          <Route 
            path="/login" 
            element={
              <Navigate to="/" state={{ showLogin: true }} />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;