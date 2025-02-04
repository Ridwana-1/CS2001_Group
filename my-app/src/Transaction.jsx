import React, { useState } from 'react';
import './Transactions.css';
import productImage1 from './product1.jpg';
import productImage2 from './product2.jpg';
import productImage3 from './product3.jpg';
import productImage4 from './product4.jpg';

const Transactions = () => {
  
  const [activePage, setActivePage] = useState('View Receipts');


  const navItems = [
    {
      name: 'View Receipts',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 17h6M9 13h6M3 4h18v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm4-2v4M17 2v4" />
        </svg>
      ),
      href: '/view-receipts'
    },
    {
      name: 'Dispute Order',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      href: '/dispute-order'
    },
    {
      name: 'Live Chat',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      href: '/live-chat'
    },
    {
      name: 'Order Status',
      icon: (
        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 7H8m12 4H8m12 4H8m12 4H8M4 7h.01M4 11h.01M4 15h.01M4 19h.01" />
        </svg>
      ),
      href: '/order-status'
    }
  ];

  return (
    <div className="page-container">
    
      <aside className="sidebar">
        <div className="sidebar-header">
    
        </div>
        <nav>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li key={item.name} className="nav-item">
                <a
                  href={item.href}
                  className={`nav-link ${activePage === item.name ? 'active' : ''}`}
                  onClick={() => setActivePage(item.name)}
                >
                  {item.icon}
                  <span className="nav-text">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

   
      <main className="main-content">
        <div className="content-header">
          <h1>Transaction History</h1>
        </div>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Item Image</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#001</td>
              <td><img src={productImage1} alt="Product 1" className="transaction-image" /></td>
              <td>£100</td>
              <td>2024-02-03</td>
              <td><span className="status completed">Completed</span></td>
            </tr>
            <tr>
              <td>#002</td>
              <td><img src={productImage2} alt="Product 2" className="transaction-image" /></td>
              <td>£50</td>
              <td>2024-02-02</td>
              <td><span className="status pending">Pending</span></td>
            </tr>
            <tr>
              <td>#003</td>
              <td><img src={productImage3} alt="Product 3" className="transaction-image" /></td>
              <td>£75</td>
              <td>2024-02-01</td>
              <td><span className="status failed">Failed</span></td>
            </tr>
            <tr>
              <td>#004</td>
              <td><img src={productImage4} alt="Product 4" className="transaction-image" /></td>
              <td>£30</td>
              <td>2024-01-30</td>
              <td><span className="status completed">Completed</span></td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Transactions;