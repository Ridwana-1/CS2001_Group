import React, { useState, useEffect } from 'react';
import './Transactions.css';
import axios from 'axios'; // Make sure axios is installed

const DisputeForm = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [disputeReference, setDisputeReference] = useState('');

  // API base URL - adjust this to your Spring Boot API endpoint
  const API_BASE_URL = 'http://localhost:3000/transactions/';

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Failed to load orders. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!selectedOrder) {
      setErrorMessage('Please select an order to dispute');
      return;
    }
    
    if (disputeReason.trim().length < 10) {
      setErrorMessage('Please provide a more detailed explanation (at least 10 characters)');
      return;
    }
    
    setErrorMessage('');
    setIsSubmitting(true);
    
    try {
      // Create dispute data object
      const disputeData = {
        orderId: selectedOrder.id,
        customerEmail: selectedOrder.customerEmail || 'customer@example.com',
        orderDetails: {
          item: selectedOrder.item,
          shop: selectedOrder.shop,
          totalPrice: selectedOrder.totalPrice,
          quantity: selectedOrder.quantity,
          orderDate: selectedOrder.orderDate,
          orderStatus: selectedOrder.orderStatus
        },
        reason: disputeReason,
        submittedAt: new Date().toISOString()
      };
      
      // Submit the data to Spring Boot API
      const response = await axios.post(`${API_BASE_URL}/disputes`, disputeData);
      
      // Get the dispute reference from the response if available
      if (response.data && response.data.reference) {
        setDisputeReference(response.data.reference);
      } else {
        setDisputeReference(`DSP-${Math.floor(Math.random() * 10000) + 1000}`);
      }
      
      // Show success message and reset form
      setDisputeSubmitted(true);
      setDisputeReason('');
      setSelectedOrder(null);
      
      // Hide success message after 8 seconds
      setTimeout(() => {
        setDisputeSubmitted(false);
      }, 8000);
    } catch (error) {
      let message = 'Failed to submit dispute. Please try again.';
      
      // Extract error message from Spring Boot response if available
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          message = error.response.data.message;
        } else if (error.response.data.error) {
          message = error.response.data.error;
        }
      }
      
      setErrorMessage(message);
      console.error('Dispute submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status completed';
      case 'pending':
        return 'status pending';
      case 'failed':
        return 'status failed';
      default:
        return 'status';
    }
  };

  if (disputeSubmitted) {
    return (
      <div className="dispute-container">
        <h2>File a Dispute</h2>
        <div className="success-message">
          <p><strong>Your dispute has been submitted successfully.</strong></p>
          <p>A confirmation email has been sent to your registered email address with all order details.</p>
          <p>Dispute reference: {disputeReference}</p>
          <p>Our support team will review your dispute within 24-48 business hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dispute-container">
      <h2>File a Dispute</h2>
      
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="loading-indicator">
          <p>Loading orders...</p>
        </div>
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
              {orders && orders.length > 0 ? (
                orders.map(order => (
                  <option key={order.id} value={order.id}>
                    #{order.id} - {order.item} (£{order.totalPrice}) - {new Date(order.orderDate).toLocaleDateString()}
                  </option>
                ))
              ) : (
                <option disabled>No orders available</option>
              )}
            </select>
          </div>

          {selectedOrder && (
            <div className="order-details">
              <h3>Order Details</h3>
              <table className="details-table">
                <tbody>
                  <tr>
                    <td>Order ID:</td>
                    <td>#{selectedOrder.id}</td>
                  </tr>
                  <tr>
                    <td>Item:</td>
                    <td>{selectedOrder.item}</td>
                  </tr>
                  <tr>
                    <td>Shop:</td>
                    <td>{selectedOrder.shop}</td>
                  </tr>
                  <tr>
                    <td>Amount:</td>
                    <td>£{selectedOrder.totalPrice}</td>
                  </tr>
                  <tr>
                    <td>Quantity:</td>
                    <td>{selectedOrder.quantity}</td>
                  </tr>
                  <tr>
                    <td>Order Date:</td>
                    <td>{new Date(selectedOrder.orderDate).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td>
                      <span className={getStatusClass(selectedOrder.orderStatus)}>
                        {selectedOrder.orderStatus}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <form onSubmit={handleSubmit} className="dispute-form">
                <div className="form-group">
                  <label htmlFor="disputeReason">Reason for Dispute:</label>
                  <textarea
                    id="disputeReason"
                    rows="4"
                    value={disputeReason}
                    onChange={(e) => {
                      setDisputeReason(e.target.value);
                      setErrorMessage('');
                    }}
                    required
                    placeholder="Please provide a detailed explanation of your dispute. Include any relevant order information or issues you experienced."
                  />
                </div>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DisputeForm;