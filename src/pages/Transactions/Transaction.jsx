import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisputeForm from './DisputeForm';
import background from '../../assets/Home.jpg'; 

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
          <h1>{activePage}</h1>
        </div>

        {loading && <div className="loading-indicator">Loading transactions...</div>}
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
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.item}</td>
                    <td>{order.shop}</td>
                    <td>£{order.totalPrice}</td>
                    <td>{order.quantity}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{order.orderStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && activePage === 'Dispute Order' && (
          <DisputeForm orders={orders} />
        )}
      </main>
    </div>
  );
};

export default Transactions;