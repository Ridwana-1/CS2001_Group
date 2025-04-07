import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelService {
  saveMessage(channelId: number, message: string) {
    return { channelId, message, timestamp: new Date() };
  }
}
