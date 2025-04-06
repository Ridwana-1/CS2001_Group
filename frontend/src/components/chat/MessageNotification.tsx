import React from 'react';
import { FaBell } from 'react-icons/fa';
import styles from '../../styles/ChatStyles.module.css';

interface MessageNotificationProps {
  message: string;
  sender: string;
  timestamp: string;
  onClick?: () => void;
}

const MessageNotification: React.FC<MessageNotificationProps> = ({
  message,
  sender,
  timestamp,
  onClick
}) => {
  return (
    <div 
      className={styles.notification}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.notificationIcon}>
        <FaBell />
      </div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationSender}>{sender}</div>
        <div className={styles.notificationMessage}>{message}</div>
        <div className={styles.notificationTime}>{timestamp}</div>
      </div>
    </div>
  );
};

export default MessageNotification; 