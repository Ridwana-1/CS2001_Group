import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';


const Transactions = () => {
  const [activePage, setActivePage] = useState('View Receipts');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

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
      .catch((error) => {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
        setLoading(false);
      });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
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

  const handleDisputeSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    // Prepare the detailed dispute report
    const disputeReport = {
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

    // Send dispute to backend and handle confirmation email
    axios.post('http://localhost:8080/swapsaviour/disputes/submit', disputeReport)
      .then((response) => {
        console.log('Dispute submitted successfully', response.data);
        setDisputeSubmitted(true);
        
        // Reset form
        setDisputeReason('');
        setSelectedOrder(null);
       
        setTimeout(() => {
          setDisputeSubmitted(false);
        }, 8000);
      })
      .catch((error) => {
        console.error('Error submitting dispute:', error);
        setError('Failed to submit dispute. Please try again later.');
      });
  };

  // Component to render the order dispute form with professional styling
  const DisputeForm = () => (
    <div className="dispute-container">
      <h2>File a Dispute</h2>
      {disputeSubmitted ? (
        <div className="success-message">
          <p><strong>Your dispute has been submitted successfully.</strong></p>
          <p>A confirmation email has been sent to your registered email address with all order details.</p>
          <p>Dispute reference: DSP-{Math.floor(Math.random() * 10000) + 1000}</p>
          <p>Our support team will review your dispute within 24-48 business hours.</p>
        </div>
      ) : (
        <>
          <div className="order-selector">
            <label htmlFor="orderSelect">Select Order to Dispute:</label>
            <select 
              id="orderSelect"
              value={selectedOrder ? selectedOrder.id : ''}
              onChange={(e) => {
                const orderId = e.target.value;
                const order = orders.find(o => o.id.toString() === orderId);
                setSelectedOrder(order || null);
              }}
            >
              <option value="">-- Select an order --</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  #{order.id} - {order.item} (£{order.totalPrice}) - {new Date(order.orderDate).toLocaleDateString()}
                </option>
              ))}
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

              <form onSubmit={handleDisputeSubmit} className="dispute-form">
                <div className="form-group">
                  <label htmlFor="disputeReason">Reason for Dispute:</label>
                  <textarea
                    id="disputeReason"
                    rows="4"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    required
                    placeholder="Please provide a detailed explanation of your dispute. Include any relevant order information or issues you experienced."
                  />
                </div>
                <button type="submit" className="submit-button">Submit Dispute</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-nav">
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'View Receipts' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('View Receipts');
                }}
              >
                <i className="fas fa-receipt"></i>
                <span className="nav-text">View Receipts</span>
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link ${activePage === 'Dispute Order' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Dispute Order');
                }}
              >
                <i className="fas fa-exclamation-circle"></i>
                <span className="nav-text">Dispute Order</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-header">
          <h1>{activePage === 'View Receipts' ? 'Transaction History' : 'Order Dispute'}</h1>
        </div>

        {loading && <div className="loading-indicator">Loading transactions...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && activePage === 'View Receipts' && (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Item</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.item}</td>
                  <td>{order.shop}</td>
                  <td>£{order.totalPrice}</td>
                  <td>{order.quantity}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td><span className={getStatusClass(order.orderStatus)}>{order.orderStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && activePage === 'Dispute Order' && <DisputeForm />}
        
      </main>
    </div>
  );
};

export default Transactions;