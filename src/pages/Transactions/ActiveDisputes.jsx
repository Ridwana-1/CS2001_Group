import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const ActiveDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState({});

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = () => {
    setLoading(true);
    axios.get('http://localhost:8080/swapsaviour/disputes/active')
      .then((response) => {
        setDisputes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching disputes:', error);
        setError('Failed to fetch disputes');
        setLoading(false);
      });
  };

  const handleApprove = (id) => {
    axios.post(`http://localhost:8080/swapsaviour/disputes/approve/${id}`)
      .then(() => fetchDisputes())
      .catch(error => console.error('Error approving dispute:', error));
  };

  const handleReject = (id) => {
    if (!rejectReason[id]) {
      alert('Please enter a reason for rejection');
      return;
    }
    axios.post(`http://localhost:8080/swapsaviour/disputes/reject/${id}`, { reason: rejectReason[id] })
      .then(() => fetchDisputes())
      .catch(error => console.error('Error rejecting dispute:', error));
  };

  const handleSendToChatbot = (id) => {
    axios.post(`http://localhost:8080/swapsaviour/disputes/chatbot/${id}`)
      .then(() => fetchDisputes())
      .catch(error => console.error('Error sending dispute to chatbot:', error));
  };

  return (
    <div className="active-disputes-container">
      <h2>Active Disputes</h2>
      {loading && <p>Loading disputes...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && disputes.length === 0 && <p>No active disputes found.</p>}
      {!loading && !error && disputes.length > 0 && (
        <table className="disputes-table">
          <thead>
            <tr>
              <th>Dispute ID</th>
              <th>Order ID</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => (
              <tr key={dispute.id}>
                <td>#{dispute.id}</td>
                <td>{dispute.orderId}</td>
                <td>{dispute.reason}</td>
                <td>{dispute.status}</td>
                <td>
                  <button onClick={() => handleApprove(dispute.id)}>Approve</button>
                  <input
                    type="text"
                    placeholder="Rejection reason"
                    value={rejectReason[dispute.id] || ''}
                    onChange={(e) => setRejectReason({ ...rejectReason, [dispute.id]: e.target.value })}
                  />
                  <button onClick={() => handleReject(dispute.id)}>Reject</button>
                  <button onClick={() => handleSendToChatbot(dispute.id)}>Send to Chatbot</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActiveDisputes;
