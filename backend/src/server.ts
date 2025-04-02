import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';

interface Client {
  id: string;
  ws: WebSocket;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  receiverId: string;
}

interface TypingStatus {
  userId: string;
  isTyping: boolean;
}

class ChatServer {
  private wss: WebSocketServer;
  private clients: Map<string, Client> = new Map();

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      const userId = this.getUserIdFromUrl(request);
      if (!userId) {
        ws.close();
        return;
      }

      // Сохраняем подключение клиента
      this.clients.set(userId, { id: userId, ws });
      console.log(`Client connected: ${userId}`);

      // Отправляем статус онлайн всем пользователям
      this.broadcastUserStatus(userId, true);

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(userId);
        console.log(`Client disconnected: ${userId}`);
        // Отправляем статус оффлайн всем пользователям
        this.broadcastUserStatus(userId, false);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${userId}:`, error);
      });
    });

    console.log('WebSocket server is running');
  }

  private getUserIdFromUrl(request: IncomingMessage): string | null {
    const { query } = parse(request.url || '', true);
    return (query.userId as string) || null;
  }

  private handleMessage(message: { type: string; payload: any }) {
    switch (message.type) {
      case 'message':
        this.handleChatMessage(message.payload);
        break;
      case 'typing':
        this.handleTypingStatus(message.payload);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private handleChatMessage(message: Message) {
    const { senderId, receiverId } = message;
    
    // Генерируем ID и временную метку для сообщения
    const enrichedMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    // Отправляем сообщение получателю
    this.sendToUser(receiverId, {
      type: 'message',
      payload: enrichedMessage
    });

    // Отправляем подтверждение отправителю
    this.sendToUser(senderId, {
      type: 'message',
      payload: enrichedMessage
    });
  }

  private handleTypingStatus(status: TypingStatus) {
    const { userId, isTyping } = status;
    
    // Отправляем статус печати всем пользователям
    this.clients.forEach((client) => {
      if (client.id !== userId) {
        this.sendToUser(client.id, {
          type: 'typing',
          payload: status
        });
      }
    });
  }

  private broadcastUserStatus(userId: string, isOnline: boolean) {
    const status = {
      type: 'status',
      payload: { userId, isOnline }
    };

    this.clients.forEach((client) => {
      if (client.id !== userId) {
        this.sendToUser(client.id, status);
      }
    });
  }

  private sendToUser(userId: string, data: any) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }
}

// Запускаем сервер на порту 8080
new ChatServer(8080); 