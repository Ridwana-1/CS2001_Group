import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('send')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
    @Body('content') content: string,
  ) {
    return this.messageService.sendMessage(senderId, receiverId, content);
  }

  @Get(':user1/:user2')
  async getMessages(@Param('user1') user1: string, @Param('user2') user2: string) {
    return this.messageService.getMessagesBetweenUsers(user1, user2);
  }
}
