import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`/api/notifications/1`).then((res) => setNotifications(res.data));
  }, []);

  const markAsRead = async (id) => {
    await axios.put(`/api/notifications/mark-read/${id}`);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      {notifications.length === 0 ? <p>No new notifications</p> : (
        notifications.map(n => (
          <div key={n.id} className="notification-card">
            <p>{n.message}</p>
            <button className="mark-read-btn" onClick={() => markAsRead(n.id)}>Mark as Read</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
