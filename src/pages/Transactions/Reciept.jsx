import React from 'react';
import PropTypes from 'prop-types';


const Receipt = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getEstimatedDelivery = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="receipt">
      <div className="receipt-header">
        <div className="receipt-logo">
          <h2>SwapSaviour</h2>
        </div>
        <div className="receipt-title">
          <h3>Order Receipt</h3>
          <span className="receipt-id">#{order.id}</span>
        </div>
        <button className="receipt-close" onClick={onClose}>×</button>
      </div>

      <div className="receipt-section receipt-summary">
        <div className="receipt-status">
          <span className={`status-indicator ${order.orderStatus.toLowerCase()}`}></span>
          <span className="status-text">{order.orderStatus}</span>
        </div>
        <div className="receipt-date">
          <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
        </div>
      </div>

      <div className="receipt-section receipt-details">
        <div className="receipt-seller-info">
          <h4>Seller Information</h4>
          <p><strong>Shop:</strong> {order.shop}</p>
          <p><strong>Seller ID:</strong> {order.sellerId || 'S-' + Math.floor(1000 + Math.random() * 9000)}</p>
          <p><strong>Contact:</strong> {order.sellerContact || order.shop.toLowerCase().replace(/\s+/g, '') + '@shop.com'}</p>
        </div>

        <div className="receipt-payment-info">
          <h4>Payment Details</h4>
          <p><strong>Payment Method:</strong> {order.paymentMethod || 'Credit Card'}</p>
          <p><strong>Payment ID:</strong> {order.paymentId || 'PAY-' + Math.floor(10000000 + Math.random() * 90000000)}</p>
          <p><strong>Transaction Date:</strong> {formatDate(order.orderDate)}</p>
        </div>
      </div>

      <div className="receipt-section receipt-items">
        <h4>Items Purchased</h4>
        <table className="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{order.item}</td>
              <td>{order.quantity}</td>
              <td>£{(order.totalPrice / order.quantity).toFixed(2)}</td>
              <td>£{order.totalPrice}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Subtotal</td>
              <td>£{order.totalPrice}</td>
            </tr>
            <tr>
              <td colSpan="3">Shipping</td>
              <td>{order.shippingCost ? `£${order.shippingCost}` : 'Free'}</td>
            </tr>
            <tr className="total-row">
              <td colSpan="3">Total</td>
              <td>£{(Number(order.totalPrice) + (order.shippingCost || 0)).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {order.orderStatus !== 'Delivered' && (
        <div className="receipt-section receipt-shipping">
          <h4>Shipping Information</h4>
          <p><strong>Shipping Address:</strong> {order.shippingAddress || '123 Customer Street, City, Country'}</p>
          <p><strong>Tracking Number:</strong> {order.trackingNumber || 'TRK-' + Math.floor(10000000 + Math.random() * 90000000)}</p>
          <p><strong>Estimated Delivery:</strong> {getEstimatedDelivery(order.orderDate)}</p>
          <div className="shipping-status">
            <div className="status-track">
              <div className={`status-point ${order.orderStatus === 'Processing' || order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? 'active' : ''}`}>
                <span>Processing</span>
              </div>
              <div className={`status-point ${order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? 'active' : ''}`}>
                <span>Shipped</span>
              </div>
              <div className={`status-point ${order.orderStatus === 'Delivered' ? 'active' : ''}`}>
                <span>Delivered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="receipt-section receipt-actions">
        <button className="action-button primary">Download PDF</button>
        <button className="action-button">Print Receipt</button>
        <button className="action-button secondary" onClick={() => {
          onClose();
        }}>Dispute Order</button>
      </div>

      <div className="receipt-footer">
        <p>Thank you for shopping with SwapSaviour!</p>
        <p>For any queries, please contact customer support at support@swapsaviour.com</p>
      </div>
    </div>
  );
};

Receipt.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    item: PropTypes.string.isRequired,
    shop: PropTypes.string.isRequired,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    orderDate: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
    sellerId: PropTypes.string,
    sellerContact: PropTypes.string,
    paymentMethod: PropTypes.string,
    paymentId: PropTypes.string,
    shippingCost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shippingAddress: PropTypes.string,
    trackingNumber: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired
};

export default Receipt;
