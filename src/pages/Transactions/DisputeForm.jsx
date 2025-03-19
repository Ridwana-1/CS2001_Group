import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    axios.get('http://localhost:8080/swapsaviour/Checkout/orders')
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please refresh the page.');
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

    axios.post(`${API_BASE_URL}/transactions/disputes`, disputeData)
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
            {orders.map(order => (
              <option key={order.id} value={order.id}>
                {order.item} - £{order.total}
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
            onChange={(e) => setEmail(e.target.value)}
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
  );
};

export default DisputeForm;
