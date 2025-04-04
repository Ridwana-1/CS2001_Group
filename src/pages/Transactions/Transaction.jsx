import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import product1 from '../../assets/product1.jpg';
import product2 from '../../assets/product2.jpg';
import product3 from '../../assets/product3.jpg';
import product4 from '../../assets/product4.jpg';
import './Transactions.css';

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // For debugging
  const userString = localStorage.getItem("user");
  const userData = userString ? JSON.parse(userString) : null;

  const getProductImages = (itemName) => {
    return [product1, product2, product3, product4];
  };

  return (
    <div className="page-container">
      <Sidebar />

      <main className="main-content">
        <div className="content-header">
          <h1>Your Transactions</h1>
          {userData && (
            <p>Showing orders for: {userData.id}</p>
          )}
        </div>

        {loading && <div className="loading-indicator">Loading transactions...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
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
                    const statusLower = order.orderStatus ? order.orderStatus.toLowerCase() : 'unknown';
                    return (
                      <tr 
                        key={order.id} 
                        className={statusLower === 'pending' ? 'pending-row' : ''}
                        onClick={() => navigate(`/receipt/${order.id}`)}
                      >
                        <td>
                          <div className="item-grid-gallery">
                            <div className="item-images">
                              {getProductImages(order.item).map((img, index) => (
                                <img key={index} src={img} alt={order.item} className="item-thumbnail" />
                              ))}
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
      </main>
    </div>
  );
};

export default Transactions;