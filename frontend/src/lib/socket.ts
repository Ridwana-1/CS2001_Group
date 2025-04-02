import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";

const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('connect', () => {
  console.log('Socket connected successfully');
});

export default socket;
