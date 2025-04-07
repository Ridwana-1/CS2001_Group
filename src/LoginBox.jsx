import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createPortal } from 'react-dom';
import './LoginBox.css';

const LoginBox = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); 
  const modalRef = useRef(null);
  
  // Reset form when opened
  useEffect(() => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setError('');
  }, []);
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const loginUser = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      
      const response = await axios.post('http://localhost:5000/login', { 
        email, 
        password 
      });
      
      if (response.data.success) {
        // Get user data from response
        const { email, role, id, first_name, last_name } = response.data;
        
        // Store user data in localStorage for persistence
        localStorage.setItem('user', JSON.stringify({
          id,
          email,
          role,
          firstName: first_name,
          lastName: last_name
        }));
        
        // Call the onLogin function passed from parent component
        if (onLogin) {
          onLogin(email, role);
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const registerUser = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError('');
      setIsLoading(true);
      
      const response = await axios.post('http://localhost:5000/register', { 
        email, 
        password,
        firstName,
        lastName
      });
      
      if (response.data.success) {
        // Switch to login tab after successful registration
        setActiveTab('login');
        setError('');
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        // Show success message
        alert('Registration successful! Please login with your credentials.');
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setError('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const switchTab = (tab) => {
    resetForm();
    setActiveTab(tab);
  };
  
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button 
            className={`tab-button ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={activeTab === 'login' ? loginUser : registerUser} className="form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* Additional fields for registration */}
          {activeTab === 'register' && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </>
          )}
          
          {activeTab === 'login' && (
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : activeTab === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        
        {activeTab === 'login' && (
          <div className="modal-footer">
            <p>Don't have an account? <span className="text-link" onClick={() => switchTab('register')}>Register now</span></p>
          </div>
        )}
        
        {activeTab === 'register' && (
          <div className="modal-footer">
            <p>Already have an account? <span className="text-link" onClick={() => switchTab('login')}>Login</span></p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default LoginBox;