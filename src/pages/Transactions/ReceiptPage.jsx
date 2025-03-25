import React, { useState, useEffect } from 'react';
import axios from 'axios';

import sampleImg1 from '../../assets/product1.jpg';
import sampleImg2 from '../../assets/product2.jpg';
import sampleImg3 from '../../assets/product3.jpg';
import sampleImg4 from '../../assets/product4.jpg';
import Receipt from './Receipt.jsx';

import { useParams, useNavigate } from 'react-router-dom';


function ReceiptPage() {
  const { orderId } = useParams(); //  order ID from URL params
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const items = [sampleImg1, sampleImg2, sampleImg3, sampleImg4];

  useEffect(() => {
    axios.get('http://localhost:8080/swapsaviour/Checkout/orders') //end point
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

  // looking for current order based on order id chosen.
  const currentOrder = orders.find(order => order.id.toString() === orderId);
  const currentIndex = orders.findIndex(order => order.id.toString() === orderId);


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

  if (loading) return <div>Loading receipt...</div>;
  if (error) return <div>{error}</div>;
  if (!currentOrder) return <div>Order not found</div>;

  return (
    <div className="receipt-page-container">
      {/* Header Section */}
      <header className="trade-management-header">
        <h1>Trade Management</h1>
        <h2>Receipt View</h2>
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
        <div className="items-preview">
          <div className="items-gallery">
            {items.map((imgSrc, index) => (
              <div key={index} className="item-image-container">
                <img src={imgSrc} alt={`Item ${index + 1}`} />
              </div>
            ))}
          </div>

          {/* Receipt Details Box */}
          <div className="receipt-details-box">
            <Receipt order={currentOrder} /> {/* Render details for the selected order */}
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
