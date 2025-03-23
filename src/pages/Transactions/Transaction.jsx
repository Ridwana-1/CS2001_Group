import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DisputeForm from './DisputeForm';
import product1 from '../../assets/product1.jpg';
import product2 from '../../assets/product2.jpg';
import product3 from '../../assets/product3.jpg';
import product4 from '../../assets/product4.jpg';

const Transactions = () => {
  const [activePage, setActivePage] = useState('Transactions');
  const [orders, setOrders] = useState([]);
  const [receipts, setReceipts] = useState([]);
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

  const getProductImages = (itemName) => {
    return [product1, product2, product3, product4];
  };

  return (
    <div className="page-container">
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-nav">
            <li className="nav-item">
              <a href="#" className={`nav-link ${activePage === 'Transactions' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('Transactions'); }}>
                <i className="fas fa-list-alt"></i>
                <span className="nav-text">Transactions</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className={`nav-link ${activePage === 'View Receipts' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('View Receipts'); }}>
                <i className="fas fa-receipt"></i>
                <span className="nav-text">View Receipts</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className={`nav-link ${activePage === 'Dispute Order' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActivePage('Dispute Order'); }}>
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

        {!loading && !error && activePage === 'Transactions' && (
          <div className="transactions-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Items</th>
                  <th>Shop</th>
                  <th>Amount</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const statusLower = order.orderStatus.toLowerCase();
                    return (
                      <tr key={order.id} className={statusLower === 'pending' ? 'pending-row' : ''}>
                        <td>
                          <div className="item-grid-gallery">
                            <div className="item-images">
                              {getProductImages(order.item).map((img, index) => (
                                <img key={index} src={img} alt={order.item} className="item-thumbnail" />
                              ))}
                            </div>
                            <div className="item-info">
                              
                            </div>
                          </div>
                        </td>
                        <td>{order.shop}</td>
                        <td>£{order.price}</td>
                        <td>{order.quantity}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`status ${statusLower}`}>{order.orderStatus}</span>
                          {statusLower === 'pending' && (
                            <div className="pending-progress-bar">
                              <div className="progress-fill"></div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && activePage === 'View Receipts' && (
          <div className="transactions-wrapper">
            {receipts.length === 0 ? (
              <p className="no-data">No receipts available.</p>
            ) : (
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Receipt ID</th>
                    <th>Details</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((receipt) => (
                    <tr key={receipt.id}>
                      <td>{receipt.id}</td>
                      <td>{receipt.details}</td>
                      <td>{new Date(receipt.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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