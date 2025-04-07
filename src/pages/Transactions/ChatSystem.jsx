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
  const [newMessageCount, setNewMessageCount] = useState(0);
  const pollingIntervalRef = useRef(null);
  const messageEndRef = useRef(null);
  const lastFetchTimeRef = useRef(new Date(0).toISOString());
  const messageIdsRef = useRef(new Set());

  // On mount, load user info from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
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
        // Reset message IDs set
        messageIdsRef.current = new Set();
        
        // Process and deduplicate messages
        const processedMessages = response.data.messages.filter(msg => {
          const msgId = msg.id || `${msg.email}-${msg.timestamp}`;
          if (messageIdsRef.current.has(msgId)) return false;
          messageIdsRef.current.add(msgId);
          return true;
        });
        
        setMessages(processedMessages);
        
        // Update last fetch time to the most recent message
        if (processedMessages.length > 0) {
          lastFetchTimeRef.current = processedMessages[processedMessages.length - 1].timestamp;
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  // Start polling for new messages with an adaptive interval
  useEffect(() => {
    if (room) {
      fetchMessages(room);
      
      // Adaptive polling: start with a 5-second interval
      let pollingInterval = 5000;
      
      pollingIntervalRef.current = setInterval(() => {
        fetchNewMessages(room);
      }, pollingInterval);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      };
    }
  }, [room]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Reset new message count when messages change
    setNewMessageCount(0);
  }, [messages]);

  // Fetch only new messages since the last message in state
  const fetchNewMessages = async (roomId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages?room=${roomId}&since=${lastFetchTimeRef.current}`
      );
      
      if (response.data.messages && response.data.messages.length > 0) {
        // Process and deduplicate new messages
        const newMessages = response.data.messages.filter(msg => {
          const msgId = msg.id || `${msg.email}-${msg.timestamp}`;
          if (messageIdsRef.current.has(msgId)) return false;
          messageIdsRef.current.add(msgId);
          return true;
        });
        
        if (newMessages.length > 0) {
          setMessages(prev => [...prev, ...newMessages]);
          setNewMessageCount(prev => prev + newMessages.length);
          
          // Update last fetch time
          lastFetchTimeRef.current = newMessages[newMessages.length - 1].timestamp;
        }
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
      lastFetchTimeRef.current = new Date(0).toISOString();
      messageIdsRef.current = new Set();
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
        // Generate a temporary ID for deduplication
        tempId: `${email}-${Date.now()}`
      };
      
      try {
        // Optimistically add message to the UI
        setMessages(prev => [...prev, messageData]);
        messageIdsRef.current.add(messageData.tempId);
        setMessage('');
        
        // Send message to the server
        const response = await axios.post('http://localhost:5000/api/messages', messageData);
        
        // If server returns an ID, update our records
        if (response.data && response.data.id) {
          messageIdsRef.current.add(response.data.id);
          // Update the message in our state with the server-assigned ID
          setMessages(prev => 
            prev.map(msg => 
              msg === messageData ? {...msg, id: response.data.id} : msg
            )
          );
        }
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
            newMessageCount={newMessageCount}
            messageEndRef={messageEndRef}
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
            newMessageCount={newMessageCount}
            messageEndRef={messageEndRef}
          />
        )}
      </div>
    </div>
  );
};

export default ChatSystem;