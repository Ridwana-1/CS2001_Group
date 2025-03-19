import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
  const [activePage, setActivePage] = useState('Transactions');
  const [orders, setOrders] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

  const submitReview = (orderId) => {
    if (!review.trim()) return;
    
    const reviewData = { orderId, rating, review };
    axios.post('http://localhost:8080/swapsaviour/reviews/submit', reviewData)
      .then(() => {
        alert('Review submitted successfully!');
        setReview('');
        setRating(5);
        setSelectedOrderId(null);
        fetchOrders();
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        setError('Failed to submit review');
      });
  };

  return (
    <div className="page-container">
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-nav">
            <li className="nav-item">
              <a href="#" className={`nav-link ${activePage === 'View Receipts' ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); setActivePage('View Receipts'); }}>
                <i className="fas fa-receipt"></i> View Receipts
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <h1>Transaction History</h1>
        {loading && <div className="loading-indicator">Loading transactions...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Item</th>
                <th>Shop</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.item}</td>
                  <td>{order.shop}</td>
                  <td>£{order.totalPrice}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.rating || 'N/A'}</td>
                  <td>{order.review || 'No review yet'}</td>
                  <td>
                    {order.orderStatus === 'Completed' && (
                      <button onClick={() => setSelectedOrderId(order.id)}>Leave Review</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedOrderId && (
          <div className="review-form">
            <h3>Leave a Review</h3>
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
            <label>Review:</label>
            <textarea value={review} onChange={(e) => setReview(e.target.value)}></textarea>
            <button onClick={() => submitReview(selectedOrderId)}>Submit</button>
            <button onClick={() => setSelectedOrderId(null)}>Cancel</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Transactions;
