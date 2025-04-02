import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [WebsocketGateway, PrismaService],
  exports: [WebsocketGateway],
})
export class WebSocketModule {}