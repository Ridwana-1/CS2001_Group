/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChannelGateway {
  @WebSocketServer()
  server: Server;

  handleMessage(client: any, payload: any): void {
    this.server.emit('message', payload);
  }
}
