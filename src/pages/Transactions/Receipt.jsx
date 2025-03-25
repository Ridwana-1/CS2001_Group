import React from 'react';
import './Receipt.css';

const Receipt = ({ order }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <h2>SwapSaviour</h2>
        <p>Receipt #{order.id}</p>
      </div>
      
      <div className="receipt-details">
        <div className="receipt-row">
          <span>Date:</span>
          <span>{formatDate(order.orderDate)}</span>
        </div>
        <div className="receipt-row">
          <span>Time:</span>
          <span>{formatTime(order.orderDate)}</span>
        </div>
        <div className="receipt-row">
          <span>Shop:</span>
          <span>{order.shop}</span>
        </div>
        <div className="receipt-row">
          <span>Status:</span>
          <span className={`status ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
        </div>
      </div>
      
      <div className="receipt-items">
        <h3>Items</h3>
        <div className="receipt-item">
          <div className="receipt-item-details">
            <span className="item-name">{order.item}</span>
            <span className="item-quantity">x{order.quantity}</span>
          </div>
          <span className="item-price">£{(order.price / order.quantity).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="receipt-summary">
        <div className="receipt-row total">
          <span>Total:</span>
          <span>£{order.price}</span>
        </div>
        <div className="receipt-row">
          <span>Payment Method:</span>
          <span>{order.paymentMethod || "Credit Card"}</span>
        </div>
      </div>
      
      <div className="receipt-footer">
        <p>Thank you for shopping with SwapSaviour!</p>
        <button className="print-button" onClick={() => window.print()}>
          <i className="fas fa-print"></i> Print Receipt
        </button>
      </div>
    </div>
  );
};

export default Receipt;