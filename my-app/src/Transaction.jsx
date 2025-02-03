import React from 'react';
import './Transactions.css'; 
import productImage1 from './product1.jpg';  
import productImage2 from './product2.jpg';
import productImage3 from './product3.jpg';
import productImage4 from './product4.jpg';

const Transactions = () => {
  return (
    <div className="transactions">
      <h1>Transaction History</h1>
      <table>
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
            <td className="status completed">Completed</td>
          </tr>
          <tr>
            <td>#002</td>
            <td><img src={productImage2} alt="Product 2" className="transaction-image" /></td> 
            <td>£50</td>
            <td>2024-02-02</td>
            <td className="status pending">Pending</td>
          </tr>
          <tr>
            <td>#003</td>
            <td><img src={productImage3} alt="Product 3" className="transaction-image" /></td> 
            <td>£75</td>
            <td>2024-02-01</td>
            <td className="status failed">Failed</td>
          </tr>
          <tr>
            <td>#004</td>
            <td><img src={productImage4} alt="Product 4" className="transaction-image" /></td> 
            <td>£30</td>
            <td>2024-01-30</td>
            <td className="status completed">Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
