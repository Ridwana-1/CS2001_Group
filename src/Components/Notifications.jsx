import React, { useState } from 'react';  // Removed 'useEffect' import as it's not being used
import './Notifications.css';  // Add custom styles for notifications

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'transaction', message: 'You have a new message regarding your recent transaction.', read: false },
    { id: 2, type: 'itemAvailability', message: 'An item you were looking for is now available.', read: false },
    { id: 3, type: 'eventReminder', message: 'Don\'t forget your upcoming event tomorrow.', read: false },
  ]);

  const [isExpanded, setIsExpanded] = useState(false);  // Track whether notifications are expanded

  const handleMarkAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDismissNotification = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const toggleExpansion = () => {
    setIsExpanded(prevState => !prevState);  // Toggle the expanded state
  };

  return (
    <div className={`notifications-container ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpansion}>
      <div className="notifications-box">
        <h3 className="notifications-title">Notifications</h3>
        {!isExpanded && notifications.length > 0 && (
          <p>{notifications.length} new notifications</p>
        )}
      </div>

      {isExpanded && (
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p>No notifications at the moment.</p>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : ''}`}
              >
                <div className="notification-message">
                  <span className="notification-type">
                    {notification.type === 'transaction' && 'Transaction Alert:'}
                    {notification.type === 'itemAvailability' && 'Item Availability:'}
                    {notification.type === 'eventReminder' && 'Event Reminder:'}
                  </span>
                  {notification.message}
                </div>

                <div className="notification-actions">
                  {!notification.read && (
                    <button className="mark-read-btn" onClick={() => handleMarkAsRead(notification.id)}>
                      Mark as Read
                    </button>
                  )}
                  <button className="dismiss-btn" onClick={() => handleDismissNotification(notification.id)}>
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
