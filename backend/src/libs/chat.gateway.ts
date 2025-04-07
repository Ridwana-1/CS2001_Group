/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendMessage(message: string) {
    this.server.emit('message', message);
  }

  handleMessage(client: Socket, payload: string): void {
    try {
      console.log(`Received message from ${client.id}: ${payload}`);
      this.server.emit('message', payload);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error handling message:', error.message);
      } else {
        console.error('Unknown error occurred');
      }
    }
  }
}
