import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Receipt from './Receipt.jsx';
import './Receipt.css';

function ReceiptPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: { 'Content-Type': 'application/json' }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orders and trades simultaneously
        const [ordersResponse, tradesResponse] = await Promise.all([
          api.get('/swapsaviour/Checkout/orders'),
          api.get(`/swapsaviour/Checkout/orders/${orderId}/trades`)
        ]);

        setOrders(ordersResponse.data);
       
        const processedTrades = tradesResponse.data.map(trade => ({
          id: trade.id,
          tradeType: trade.tradeType || 'Unknown',
          status: trade.tradeStatus || 'Pending',
          price: trade.tradePrice || 0,
          itemExchanged: trade.itemExchanged || 'No item specified',
          quantityReceived: trade.quantityReceived || 0,
          quantityGiven: trade.quantityGiven || 0,
          date: new Date(trade.tradeDate).toLocaleDateString() 
        }));

        setTrades(processedTrades);
      } catch (err) {
        console.error("API Error:", err);
        setError(`Failed to load data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchData();
    } else {
      setError("No order ID provided");
    }
  }, [orderId]);

  const currentOrder = orders.find(order => order.id?.toString() === orderId);
  const currentIndex = orders.findIndex(order => order.id?.toString() === orderId);

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(`/receipt/${orders[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < orders.length - 1) {
      navigate(`/receipt/${orders[currentIndex + 1].id}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading receipt details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h2>Error Loading Receipt</h2>
        <p>{error}</p>
        <button onClick={handleBackToOrders}>Back to Orders</button>
      </div>
    );
  }
  
  if (!currentOrder) {
    return (
      <div className="not-found-container">
        <h2>Trade #{orderId} not found</h2>
        <p>The trade receipt you're looking for doesn't exist.</p>
        <button onClick={handleBackToOrders}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="receipt-page-container">
      <header className="trade-management-header">
        <h1>Trade Receipt</h1>
        <div className="order-navigation">
          <span className="order-id">Trade #{orderId}</span>
          <div className="nav-controls">
            <button 
              className="nav-button" 
              onClick={handlePrev} 
              disabled={currentIndex <= 0}
            >
              ← Previous
            </button>
            <span className="pagination-info">{currentIndex + 1} of {orders.length}</span>
            <button 
              className="nav-button" 
              onClick={handleNext} 
              disabled={currentIndex >= orders.length - 1}
            >
              Next →
            </button>
          </div>
        </div>
      </header>

      <div className="receipt-main-content">
        <div className="receipt-actions">
          <button 
            className="action-button" 
            onClick={handlePrint}
          >
            Print Receipt
          </button>
          <button 
            className="action-button" 
            onClick={handleBackToOrders}
          >
            Back to Orders
          </button>
        </div>
        
        <div className="receipt-content-wrapper">
          <div className="receipt-details-box">
            <Receipt 
              order={currentOrder} 
              trades={trades}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptPage;