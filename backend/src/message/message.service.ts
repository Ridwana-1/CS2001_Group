import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.messages.create({
      data: {
        senderId,
        receiverId,
        content,
      },
    });
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string) {
    return this.prisma.messages.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
