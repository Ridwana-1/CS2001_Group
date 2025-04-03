import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const ChatSystem = () => {
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const pollingIntervalRef = useRef(null);

  // On mount, load user info from localStorage (or from another global state)
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedInfo = JSON.parse(userInfo);
      setEmail(parsedInfo.email);
      setIsAdmin(parsedInfo.role === 'admin');
      fetchRooms(parsedInfo.email);
    }
  }, []);

  // Fetch available rooms for the user
  const fetchRooms = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms?email=${userEmail}`);
      if (response.data.rooms && response.data.rooms.length > 0) {
        setRoom(response.data.rooms[0].id);
        fetchMessages(response.data.rooms[0].id);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // Fetch message history from the database
  const fetchMessages = async (roomId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/messages?room=${roomId}`);
      if (response.data.messages) {
        setMessages(response.data.messages);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  // Start polling for new messages when a room is selected
  useEffect(() => {
    if (room) {
      fetchMessages(room);
      pollingIntervalRef.current = setInterval(() => {
        fetchNewMessages(room);
      }, 3000); // Poll every 3 seconds

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [room]);

  // Fetch only new messages since the last message in state
  const fetchNewMessages = async (roomId) => {
    try {
      const lastMessageTime =
        messages.length > 0 ? messages[messages.length - 1].timestamp : new Date(0).toISOString();
      const response = await axios.get(
        `http://localhost:5000/api/messages?room=${roomId}&since=${lastMessageTime}`
      );
      if (response.data.messages && response.data.messages.length > 0) {
        setMessages(prev => [...prev, ...response.data.messages]);
      }
    } catch (error) {
      console.error('Error fetching new messages:', error);
    }
  };

  // Switch to a different chat room
  const switchRoom = (roomId) => {
    if (roomId) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setRoom(roomId);
      setMessages([]);
      fetchMessages(roomId);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (message && room) {
      const messageData = {
        email,
        message,
        room,
        timestamp: new Date().toISOString(),
      };
      try {
        // Send message to the server
        await axios.post('http://localhost:5000/api/messages', messageData);
        // Optimistically add message to the UI
        setMessages(prev => [...prev, messageData]);
        setMessage('');
        // Fetch new messages to ensure we have the latest
        fetchNewMessages(room);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-layout" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="chat-container" style={{ flex: 1, padding: '20px' }}>
        {isAdmin ? (
          <AdminDashboard
            email={email}
            room={room}
            setRoom={switchRoom}
            messages={messages}
            sendMessage={sendMessage}
            message={message}
            setMessage={setMessage}
            loading={loading}
          />
        ) : (
          <UserDashboard
            email={email}
            room={room}
            setRoom={switchRoom}
            messages={messages}
            sendMessage={sendMessage}
            message={message}
            setMessage={setMessage}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
