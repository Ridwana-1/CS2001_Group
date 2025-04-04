import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import './Transactions.css';

const DisputeForm = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; //Node js Endpoint 
 
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get and parse the user from localStorage
    try {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        fetchOrdersByUserId(userData.id);
        
      } else {
        setError('User not logged in || User data incomplete - missing ID');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
      setError('Error retrieving user information');
      setLoading(false);
    }
  }, []); // Run only on component mount

  const fetchOrdersByUserId = (userId) => {
    setLoading(true);
    console.log(`Fetching orders for user ID: ${userId}`);
    
    axios.get(`http://localhost:8080/swapsaviour/Checkout/orders/user/${userId}`)
      .then((response) => {
        console.log('Orders received:', response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setError(`Failed to fetch orders: ${error.message}`);
        setLoading(false);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedOrder) {
      setError('Please select an order to dispute');
      return;
    }
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!reason) {
      setError('Please select a reason for your dispute');
      return;
    }

    setLoading(true);
    setError(null);

    const disputeData = {
      orderId: selectedOrder,
      email,
      reason,
      description: details
    };

    axios.post(`${API_BASE_URL}/transactions/disputes`, disputeData) // stores dispute in db after 
      .then(response => {
        setSuccess(true);
        setLoading(false);
        setSelectedOrder('');
        setEmail('');
        setReason('');
        setDetails('');
      })
      .catch(err => {
        console.error('Error submitting dispute:', err);
        setError('Failed to submit dispute. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="page-container">
      <Sidebar /> 

      <main className="main-content">
        <div className="dispute-form-container">
          <h2>File a Dispute</h2>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              Your dispute has been successfully submitted. We will contact you soon.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="order-select">Select Order to Dispute:</label>
              <select 
                id="order-select"
                value={selectedOrder} 
                onChange={(e) => setSelectedOrder(e.target.value)}
                required
              >
                <option value="">-- Select an order --</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>
                    Order {order.id} : {order.item} 
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email:</label>
              <input 
                type="email" 
                id="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} // storing user email to send confirmation of dispute processing
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reason-select">Reason for Dispute:</label>
              <select 
                id="reason-select"
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">-- Select a reason --</option>
                <option value="Item not received">Item not received</option>
                <option value="Item different than described">Item different than described</option>
                <option value="Damaged item">Damaged item</option>
                <option value="Wrong item">Wrong item</option>
                <option value="Unauthorized charge">Unauthorized charge</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="details">Additional Details:</label>
              <textarea 
                id="details"
                value={details} 
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide more details about the dispute..."
                rows={5}
              />
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DisputeForm;