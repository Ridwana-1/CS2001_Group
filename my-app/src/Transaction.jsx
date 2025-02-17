import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';
import productImage1 from './product1.jpg';
import productImage2 from './product2.jpg';
import productImage3 from './product3.jpg';
import productImage4 from './product4.jpg';

const Transactions = () => {
  const [activePage, setActivePage] = useState('View Receipts');
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
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
  }, []);

 
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

  return (
    <div className="page-container">
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-nav">
            <li className="nav-item">
              <a href="/view-receipts" className={`nav-link ${activePage === 'View Receipts' ? 'active' : ''}`} onClick={() => setActivePage('View Receipts')}>
                <span className="nav-text">View Receipts</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-header">
          <h1>Transaction History</h1>
        </div>

        {/* Show loading / error messages */}
        {loading && <p>Loading transactions...</p>}
        {error && <p className="error-message">{error}</p>}

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
      </main>
    </div>
  );
};

export default Transactions;
