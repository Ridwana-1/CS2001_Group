import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getChats(@Req() req: any) {
    const chats = await this.prisma.channel.findMany({
      where: {
        users: {
          some: {
            id: req.user.id
          }
        }
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
        },
      },
    });

    return {
      chats: chats.map(chat => {
        const otherUser = chat.users.find(user => user.id !== req.user.id);
        const lastMessage = chat.messages[0];
        
        if (!otherUser) {
          return null;
        }

        return {
          id: chat.id,
          recipientId: otherUser.id,
          recipientName: otherUser.fullname || 'Unknown User',
          recipientAvatar: otherUser.picture || null,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            timestamp: lastMessage.createdAt,
            unread: false, // TODO: Implement unread status
          } : null,
        };
      }).filter(Boolean),
    };
  }

  @Post()
  async createChat(@Body() body: { recipientId: string }, @Req() req: any) {
    // Check if chat already exists
    const existingChat = await this.prisma.channel.findFirst({
      where: {
        AND: [
          {
            users: {
              some: {
                id: req.user.id
              }
            }
          },
          {
            users: {
              some: {
                id: body.recipientId
              }
            }
          }
        ]
      },
      include: {
        users: true
      }
    });

    if (existingChat) {
      const otherUser = existingChat.users.find(user => user.id !== req.user.id);
      if (!otherUser) {
        throw new Error('Recipient user not found');
      }

      return {
        id: existingChat.id,
        recipientId: otherUser.id,
        recipientName: otherUser.fullname || 'Unknown User',
        recipientAvatar: otherUser.picture || null,
      };
    }

    // Create new chat
    const newChat = await this.prisma.channel.create({
      data: {
        name: 'Direct Message',
        users: {
          connect: [
            { id: req.user.id },
            { id: body.recipientId }
          ]
        }
      },
      include: {
        users: true
      }
    });

    const otherUser = newChat.users.find(user => user.id !== req.user.id);
    if (!otherUser) {
      throw new Error('Recipient user not found');
    }

    return {
      id: newChat.id,
      recipientId: otherUser.id,
      recipientName: otherUser.fullname || 'Unknown User',
      recipientAvatar: otherUser.picture || null,
    };
  }

  @Get(':chatId/messages')
  async getChatMessages(@Param('chatId') chatId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        channelId: chatId
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        sender: true
      }
    });

    return {
      messages: messages.map(message => ({
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        timestamp: message.createdAt,
      })),
    };
  }

  @Post(':chatId/messages')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body() body: { content: string },
    @Req() req: any
  ) {
    const message = await this.prisma.message.create({
      data: {
        content: body.content,
        senderId: req.user.id,
        channelId: chatId,
      },
      include: {
        sender: true
      }
    });

    return {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      timestamp: message.createdAt,
    };
  }
} 