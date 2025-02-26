import React, { useState } from 'react';
import './Receipts.css';
import productImage1 from './product1.jpg';
import productImage2 from './product2.jpg';
import productImage3 from './product3.jpg';

const Receipts = () => {
  const [receipts] = useState([
    {
      id: '#101',
      image: productImage1,
      itemName: 'Fresh Apples',
      amount: '£5',
      date: '2024-02-03',
      status: 'Completed',
      items: [
        { name: 'Fresh Apples (1kg)', quantity: 1, price: '£5' }
      ],
      shippingAddress: {
        name: 'John Doe',
        street: '123 Grocery Lane',
        city: 'London',
        postcode: 'SW1A 1AA'
      },
      paymentMethod: 'Mastercard',
      cardLastFour: '1234'
    },
    {
      id: '#102',
      image: productImage2,
      itemName: 'Organic Bananas',
      amount: '£3',
      date: '2024-02-02',
      status: 'Pending',
      items: [
        { name: 'Organic Bananas (1kg)', quantity: 1, price: '£3' }
      ],
      shippingAddress: {
        name: 'Jane Smith',
        street: '456 Fresh Market St',
        city: 'Manchester',
        postcode: 'M1 1AE'
      },
      paymentMethod: 'Visa',
      cardLastFour: '5678'
    },
    {
      id: '#103',
      image: productImage3,
      itemName: 'Loaf of Bread',
      amount: '£2',
      date: '2024-02-01',
      status: 'Completed',
      items: [
        { name: 'Whole Grain Bread', quantity: 1, price: '£2' }
      ],
      shippingAddress: {
        name: 'Michael Brown',
        street: '789 Bakery Ave',
        city: 'Birmingham',
        postcode: 'B1 1BB'
      },
      paymentMethod: 'PayPal',
      cardLastFour: null
    }
  ]);

  return (
    <div className="receipts-container">
      <div className="receipts-header">
        <h1>Trade History</h1>
      </div>

      <div className="receipts-list">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="receipt-card">
            <img src={receipt.image} alt={receipt.itemName} className="receipt-image" />
            <div className="receipt-info">
              <h3>{receipt.itemName}</h3>
              <p><strong>Order ID:</strong> {receipt.id}</p>
              <p><strong>Amount:</strong> {receipt.amount}</p>
              <p><strong>Date:</strong> {receipt.date}</p>
              <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
              {receipt.cardLastFour && (
                <p><strong>Card:</strong> **** **** **** {receipt.cardLastFour}</p>
              )}
              <p>
                <strong>Status:</strong>
                <span className={`status ${receipt.status.toLowerCase()}`}> {receipt.status}</span>
              </p>
              <div className="receipt-actions">
                <button className="btn print-receipt" onClick={() => window.print()}>Print Receipt</button>
                <button className="btn download-receipt">Download PDF</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Receipts;
