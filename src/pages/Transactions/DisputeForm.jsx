import React, { useState, useEffect, useCallback } from 'react';
import './Transactions.css';
import axios from 'axios';

const DisputeForm = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [disputeReference, setDisputeReference] = useState('');

  const BASE_URL = 'http://localhost:8080/transactions';

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Failed to load orders. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrder) {
      setErrorMessage('Please select an order to dispute.');
      return;
    }
    if (!disputeReason) {
      setErrorMessage('Please select a dispute reason.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const disputeData = {
        orderId: selectedOrder.id,
        reason: disputeReason,
        description: additionalDetails
      };

      console.log("Sending dispute request:", disputeData);
      const response = await axios.post(`${BASE_URL}/disputes`, disputeData);

      if (response.data && response.data.id) {
        setDisputeReference(`DSP-${response.data.id}`);
      } else {
        setDisputeReference(`DSP-${Math.floor(Math.random() * 10000) + 1000}`);
      }

      setDisputeSubmitted(true);
      setDisputeReason('');
      setAdditionalDetails('');
      setSelectedOrder(null);

      setTimeout(() => {
        setDisputeSubmitted(false);
      }, 8000);
    } catch (error) {
      let message = 'Failed to submit dispute. Please try again.';
      if (error.response && error.response.data) {
        message = error.response.data.message || error.response.data.error || message;
      }
      setErrorMessage(message);
      console.error('Dispute submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dispute-container">
      <h2>File a Dispute</h2>

      {errorMessage && <div className="error-message"><p>{errorMessage}</p></div>}

      {isLoading ? (
        <div className="loading-indicator"><p>Loading orders...</p></div>
      ) : (
        <>
          <div className="order-selector">
            <label htmlFor="orderSelect">Select Order to Dispute:</label>
            <select 
              id="orderSelect"
              value={selectedOrder?.id || ''}
              onChange={(e) => {
                const orderId = e.target.value;
                const order = orders.find(o => o.id.toString() === orderId);
                setSelectedOrder(order || null);
                setErrorMessage('');
              }}
            >
              <option value="">-- Select an order --</option>
              {orders.length > 0 ? (
                orders.map(order => (
                  <option key={order.id} value={order.id}>
                    #{order.id} - {order.item || 'Unknown Item'} (£{order.totalPrice || '0.00'}) - {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Unknown Date'}
                  </option>
                ))
              ) : (
                <option disabled>No orders available</option>
              )}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="dispute-form">
            <div className="form-group">
              <label htmlFor="disputeReason">Reason for Dispute:</label>
              <select
                id="disputeReason"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                required
              >
                <option value="">-- Select a reason --</option>
                <option value="FRESH">Item not fresh</option>
                <option value="DOUBLE_CHARGE">Double charged</option>
                <option value="MISSING">Missing items</option>
                <option value="SPOILED">Spoiled food</option>
                <option value="LATE">Late delivery</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="additionalDetails">Additional Details:</label>
              <textarea
                id="additionalDetails"
                rows="4"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Provide more details about the dispute..."
              />
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </form>
        </>
      )}

      {disputeSubmitted && (
        <div className="success-message">
          <p>Dispute submitted successfully! Reference: <strong>{disputeReference}</strong></p>
        </div>
      )}
    </div>
  );
};

export default DisputeForm;