import React from 'react';
import './Receipt.css';

function Receipt({ order, trades, tradesLoading }) {
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format price with currency symbol
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '--';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get status class based on trade status
  const getStatusClass = (status) => {
    if (!status) return '';
    
    switch(status.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'canceled':
        return 'canceled';
      default:
        return '';
    }
  };

  // Get status indicator class
  const getStatusIndicatorClass = (status) => {
    if (!status) return '';
    
    switch(status.toLowerCase()) {
      case 'completed':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'canceled':
        return 'status-canceled';
      default:
        return '';
    }
  };

  return (
    <div className="receipt-container">
      <div className="receipt-header">
        <div>
          <h3>Order #{order.id}</h3>
          <div className="order-date">
            {formatDate(order.date)}
          </div>
        </div>
      </div>
      
      <div className="receipt-body">
        <div className="order-summary">
          <p className="summary-label">Total Trades:</p>
          <p className="summary-value">{trades.length}</p>
          
          {order.orderTotal && (
            <>
              <p className="summary-label">Order Total:</p>
              <p className="summary-value">{formatPrice(order.orderTotal)}</p>
            </>
          )}
        </div>
        
        <div className="trade-section">
          <h4>Trades in this Order</h4>
          
          {tradesLoading ? (
            <div className="trades-loading">Loading trades information...</div>
          ) : trades.length === 0 ? (
            <div className="empty-trades">No trades found for this order.</div>
          ) : (
            <div className="trades-list">
              {trades.map((trade, index) => (
                <div 
                  key={index} 
                  className={`trade-item ${getStatusClass(trade.tradeStatus)}`}
                >
                  {trade.shop && (
                    <span className="shop-badge">
                      {trade.shop}
                    </span>
                  )}
                  
                  <div className="trade-info-grid">
                    <div className="trade-type">
                      {trade.tradeType || 'Standard Trade'}
                    </div>
                    
                    <div className="trade-status">
                      <span className={`status-indicator ${getStatusIndicatorClass(trade.tradeStatus)}`}></span>
                      {trade.tradeStatus || 'Unknown Status'}
                    </div>
                    
                    <div className="trade-price">
                      <div className="price-total">
                        {formatPrice(trade.priceTotal)}
                      </div>
                      {trade.priceIndividual !== null && trade.priceIndividual !== undefined && (
                        <div className="price-individual">
                          {formatPrice(trade.priceIndividual)} each
                        </div>
                      )}
                    </div>
                    
                    {trade.itemExchanged ? (
                      <div className="trade-item-exchanged">
                        <span className="exchanged-label">Exchanged:</span> {trade.itemExchanged}
                      </div>
                    ) : (
                      <div className="trade-item-exchanged no-item-exchanged">
                        No items exchanged
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Receipt;