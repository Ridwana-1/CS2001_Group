import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5500'],
    credentials: true
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('WebsocketGateway');

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, payload: { channelId: string; userId: string }) {
    client.join(payload.channelId);
    this.logger.log(`User ${payload.userId} joined room ${payload.channelId}`);
    return { event: 'joinedRoom', data: payload };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, payload: { channelId: string; userId: string }) {
    client.leave(payload.channelId);
    this.logger.log(`User ${payload.userId} left room ${payload.channelId}`);
    return { event: 'leftRoom', data: payload };
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: { channelId: string; userId: string; content: string }) {
    this.server.to(payload.channelId).emit('newMessage', payload);
    return { event: 'messageSent', data: payload };
  }
}