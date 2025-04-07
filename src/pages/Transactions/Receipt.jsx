import React, { useState, useEffect } from 'react';
import './Receipt.css';

function Receipt({ order = {}, trades = [] }) {
  const [activeTab, setActiveTab] = useState('summary');
 

  
  const calculateTotals = () => {
    if (!trades || trades.length === 0) {
      return {
        totalAmount: 0,
        itemsTraded: 0,
        completedTrades: 0
      };
    }

    const totalAmount = trades.reduce((sum, trade) => {
      const price = Number(trade.price) || 0;
      return sum + price;
    }, 0);
    
    const itemsTraded = trades.length;
    const completedTrades = trades.filter(trade => 
      trade.status === 'Completed' || 
      trade.status === 'completed' || 
      trade.tradeStatus === 'Completed' || 
      trade.tradeStatus === 'completed'
    ).length;
    
    return {
      totalAmount,
      itemsTraded,
      completedTrades
    };
  };

  const { totalAmount, itemsTraded, completedTrades } = calculateTotals();
  
  
  const getStatusCounts = () => {
    if (!trades || trades.length === 0) {
      return {};
    }
    
    return trades.reduce((counts, trade) => {
    
      const status = trade.status || trade.tradeStatus || 'Unknown';
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {});
  };
  
  const statusCounts = getStatusCounts();
  
  // Color mapping for status 
  const statusColorMap = {
    'Pending': '#FFC107',
    'pending': '#FFC107',
    'In Progress': '#2196F3',
    'in progress': '#2196F3',
    'inprogress': '#2196F3',
    'Completed': '#4CAF50',
    'completed': '#4CAF50',
    'Cancelled': '#F44336',
    'cancelled': '#F44336',
    'Disputed': '#9C27B0',
    'disputed': '#9C27B0',
    'Unknown': '#9E9E9E'
  };
  
  // Get status color 
  const getStatusColor = (status) => {
    if (!status) return '#9E9E9E'; 
    // Check for case-insensitive matches
    const normalizedStatus = status.toLowerCase();
    for (const [key, value] of Object.entries(statusColorMap)) {
      if (key.toLowerCase() === normalizedStatus) {
        return value;
      }
    }
    return '#9E9E9E'; // Default if no match
  };
  
  // Calculate progress segments for the progress bar with safeguards
  const calculateProgressSegments = () => {
    const total = trades?.length || 0;
    if (total === 0) return [];
    
    return Object.keys(statusCounts).map(status => ({
      status,
      width: (statusCounts[status] / total) * 100,
      color: getStatusColor(status)
    }));
  };
  
  const progressSegments = calculateProgressSegments();

  
  const safeGet = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === undefined || result === null) return defaultValue;
      result = result[key];
    }
    
    return result !== undefined && result !== null ? result : defaultValue;
  };

  // Format currency value
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    const numValue = Number(value);
    return isNaN(numValue) ? '£0.00' : `£${numValue.toFixed(2)}`;
  };
  
  return (
    <div className="receipt-container">
      {/* Header Section */}
      <div className="receipt-header">
        <div className="receipt-logo">SwapSaviour</div>
        <div className="receipt-title">
          Trade Receipt #{safeGet(order, 'id', 'N/A')}
        </div>
        <div className="receipt-date">
          {safeGet(order, 'orderDate') 
            ? new Date(order.orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
          }
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="receipt-tabs">
        <button
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`tab-button ${activeTab === 'trades' ? 'active' : ''}`}
          onClick={() => setActiveTab('trades')}
        >
          Trade Details
        </button>
      </div>
      {/* Tab Content */}
      <div className="receipt-content">
        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="receipt-summary">
            <div className="summary-row">
              <span>Trade Reference</span>
              <span>#{safeGet(order, 'id', 'N/A')}</span>
            </div>
            
            <div className="summary-row">
              <span>Items Traded</span>
              <span>{itemsTraded}</span>
            </div>
            <div className="summary-row">
              <span>Completed Trades</span>
              <span>{completedTrades} of {itemsTraded}</span>
            </div>
            <div className="summary-row">
              <span>Location</span>
              <span>{safeGet(order, 'location', 'Not specified')}</span>
            </div>
            <div className="summary-row total">
              <span>Total Value</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        )}
        
        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <div className="receipt-trades">
            {trades && trades.length > 0 ? (
              <table className="trades-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Item</th>
                    <th>Received</th>
                    <th>Given</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, index) => (
                    <tr key={trade.id || index}>
                      <td>{trade.id || 'N/A'}</td>
                      <td>{trade.tradeType || trade.type || 'Unknown'}</td>
                      <td>{trade.itemExchanged || trade.item || 'No item specified'}</td>
                      <td>{trade.quantityReceived || trade.received || '0'}</td>
                      <td>{trade.quantityGiven || trade.given || '0'}</td>
                      <td>{formatCurrency(trade.price || trade.tradePrice)}</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(trade.status || trade.tradeStatus) }}
                        >
                          {trade.status || trade.tradeStatus || 'Unknown'}
                        </span>
                      </td>
                      <td>{trade.date || 
                           (trade.tradeDate && new Date(trade.tradeDate).toLocaleDateString()) || 
                           'No date'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="total-label">Total:</td>
                    <td>{formatCurrency(totalAmount)}</td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="no-trades">
                <p>No trades found for this order</p>
               
              </div>
            )}
          </div>
        )}
        
        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="status-overview">
            {Object.keys(statusCounts).length > 0 ? (
              <>
                <div className="status-cards">
                  {Object.keys(statusCounts).map(status => (
                    <div 
                      key={status} 
                      className="status-card"
                      style={{ borderColor: getStatusColor(status) }}
                    >
                      <div className="status-count">{statusCounts[status]}</div>
                      <div className="status-label">{status}</div>
                    </div>
                  ))}
                </div>
                
                <div className="status-progress">
                  <h4>Trade Status Distribution</h4>
                  <div className="progress-container">
                    {progressSegments.map((segment, index) => (
                      <div
                        key={index}
                        className="progress-segment"
                        style={{
                          width: `${segment.width}%`,
                          backgroundColor: segment.color
                        }}
                      />
                    ))}
                  </div>
                  <div className="progress-legend">
                    {progressSegments.map((segment, index) => (
                      <div key={index} className="legend-item">
                        <div 
                          className="legend-color" 
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="legend-label">{segment.status}</span>
                        <span className="legend-percent">
                          {segment.width.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-trades">
                <p>No status data available</p>

              </div>
            )}
          </div>
        )}
        
       
        
      </div>
      
 
      </div>
   
  );
}

export default Receipt;