import React, { useState, useEffect } from 'react';
import axios from 'axios';

import sampleImg1 from '../../assets/product1.jpg';
import sampleImg2 from '../../assets/product2.jpg';
import sampleImg3 from '../../assets/product3.jpg';
import sampleImg4 from '../../assets/product4.jpg';
import Receipt from './Receipt.jsx';

import { useParams, useNavigate } from 'react-router-dom';
import './Receipt.css'; 

function ReceiptPage() {
  const { orderId } = useParams(); // order ID from URL params
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tradesLoading, setTradesLoading] = useState(false);
  const [error, setError] = useState(null);
  const items = [sampleImg1, sampleImg2, sampleImg3, sampleImg4];

  // Fetch all orders
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

  // Fetch trades for the current order whenever orderId changes
  useEffect(() => {
    if (orderId) {
      setTradesLoading(true);
      axios.get(`http://localhost:8080/swapsaviour/Checkout/orders/${orderId}/trades`)
        .then((response) => {

          // Filter the response to only keep the fields we want
          const filteredTrades = response.data.map(trade => ({
            tradeType: trade.tradeType || 'Standard',
            tradeStatus: trade.tradeStatus || 'Pending',
            priceIndividual: trade.priceIndividual || 0,
            priceTotal: trade.priceTotal || 0,
            itemExchanged: trade.itemExchanged || null,
            shop: trade.shop || 'Trader Store'
          }));
          
          setTrades(filteredTrades);
          setTradesLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching trades:', error);
          setTrades([]);
          setTradesLoading(false);
        });
    }
  }, [orderId]);

  // Looking for current order based on order id chosen
  const currentOrder = orders.find(order => order.id?.toString() === orderId);
  const currentIndex = orders.findIndex(order => order.id?.toString() === orderId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevOrderId = orders[currentIndex - 1].id;
      navigate(`/receipt/${prevOrderId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < orders.length - 1) {
      const nextOrderId = orders[currentIndex + 1].id;
      navigate(`/receipt/${nextOrderId}`);
    }
  };

  if (loading) return <div className="loading-container">Loading receipt...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!currentOrder) return <div className="not-found-container">Order not found</div>;

  return (
    <div className="receipt-page-container">
      {/* Header Section */}
      <header className="trade-management-header">
        <h1>Trade Management</h1>
        <h2>Receipt View</h2>
        <div className="order-navigation">
          <span>Order #{orderId}</span>
          <div className="nav-controls">
            <button 
              className="nav-button" 
              onClick={handlePrev} 
              disabled={currentIndex <= 0}
            >
              Previous
            </button>
            <span className="order-count">{currentIndex + 1} of {orders.length}</span>
            <button 
              className="nav-button" 
              onClick={handleNext} 
              disabled={currentIndex >= orders.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="receipt-main-content">
        {/* Left Navigation Arrow */}
        <button 
          className="nav-arrow-btn" 
          onClick={handlePrev} 
          disabled={currentIndex <= 0}
        >
          &lt;
        </button>

        {/* Items Preview Section */}
        <div className="receipt-content-wrapper">
          <div className="items-preview">
            <h3 className="section-title">Items in Order</h3>
            <div className="items-gallery">
              {items.map((imgSrc, index) => (
                <div key={index} className="item-image-container">
                  <img src={imgSrc} alt={`Item ${index + 1}`} />
                  <div className="item-overlay">Item {index + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Details Box */}
          <div className="receipt-details-box">
            <Receipt 
              order={currentOrder} 
              trades={trades} 
              tradesLoading={tradesLoading}
            />
          </div>
        </div>

        {/* Right Navigation Arrow */}
        <button 
          className="nav-arrow-btn" 
          onClick={handleNext} 
          disabled={currentIndex >= orders.length - 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default ReceiptPage;