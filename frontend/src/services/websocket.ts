import { EventEmitter } from 'events';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  receiverId: string;
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
}

export interface UserStatus {
  userId: string;
  isOnline: boolean;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private events = new EventEmitter();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;

  constructor(private baseUrl: string = 'ws://localhost:8080') {}

  connect(userId: string) {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(`${this.baseUrl}/chat?userId=${userId}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.events.emit('connected');
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'message':
            this.events.emit('message', data.payload);
            break;
          case 'typing':
            this.events.emit('typing', data.payload);
            break;
          case 'status':
            this.events.emit('userStatus', data.payload);
            break;
          default:
            console.warn('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.events.emit('disconnected');
      this.reconnect(userId);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.events.emit('error', error);
    };
  }

  private reconnect(userId: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect(userId);
    }, this.reconnectTimeout);
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp'>) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send(JSON.stringify({
      type: 'message',
      payload: message
    }));
  }

  sendTypingStatus(status: TypingStatus) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send(JSON.stringify({
      type: 'typing',
      payload: status
    }));
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.events.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void) {
    this.events.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();
export default websocketService; 