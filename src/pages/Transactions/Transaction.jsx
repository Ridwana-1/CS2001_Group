import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisputeForm from './DisputeForm'; // Assuming this component exists

const Transactions = () => {
  const [activePage, setActivePage] = useState('View Receipts');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDisputeSubmit = (disputeReport) => {
    axios.post('http://localhost:8080/swapsaviour/disputes/submit', disputeReport)
      .then((response) => {
        console.log('Dispute submitted successfully', response.data);
      })
      .catch((error) => {
        console.error('Error submitting dispute:', error);
        setError('Failed to submit dispute. Please try again later.');
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

  const renderStatusWithAnimation = (status, orderId) => {
    if (status.toLowerCase() === 'pending') {
      return (
        <div className="pending-status-container">
          <span className={getStatusClass(status)}>{status}</span>
          <div className="pending-animation">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
          <div className="pending-progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="pending-status-text">Your order is being processed</div>
        </div>
      );
    }
    return <span className={getStatusClass(status)}>{status}</span>;
  };

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
          {activePage === 'View Receipts' && (
            <button className="refresh-button" onClick={fetchOrders}>
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
          )}
        </div>

        {loading && <div className="loading-indicator">
          <div className="loading-spinner"></div>
          Loading transactions...
        </div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && activePage === 'View Receipts' && (
          <div className="transactions-wrapper">
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
                  <tr key={order.id} className={order.orderStatus.toLowerCase() === 'pending' ? 'pending-row' : ''}>
                    <td>#{order.id}</td>
                    <td>{order.item}</td>
                    <td>{order.shop}</td>
                    <td>£{order.totalPrice}</td>
                    <td>{order.quantity}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{renderStatusWithAnimation(order.orderStatus, order.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {orders.some(order => order.orderStatus.toLowerCase() === 'pending') && (
              <div className="pending-orders-summary">
                <div className="pulse-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="pending-orders-text">
                  <h3>Orders in progress</h3>
                  <p>We'll notify you when your pending orders are completed</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !error && activePage === 'Dispute Order' && (
          <DisputeForm 
            orders={orders} 
            onSubmit={handleDisputeSubmit}
          />
        )}
      </main>
    </div>
  );
};

export default Transactions;