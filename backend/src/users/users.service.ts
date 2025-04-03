/**
 * Users Service
 * @author Sultan Jurabekov
 * @functionality User management service that handles:
 * - User CRUD operations
 * - User search functionality
 * - Online status tracking
 * - Last seen updates
 * - User profile management
 * - Avatar handling
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async searchUsers(query: string, currentUserId: string) {
    console.log('Searching users with query:', query, 'currentUserId:', currentUserId);
    
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const users = await this.prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                { email: { contains: query, mode: 'insensitive' } },
                { fullname: { contains: query, mode: 'insensitive' } },
              ],
            },
            {
              id: { not: currentUserId }, // Don't include the current user
            },
          ],
        },
        select: {
          id: true,
          email: true,
          fullname: true,
          profile: {
            select: {
              bio: true,
              avatarUrl: true
            }
          }
        },
        take: 10,
      });

      console.log('Found users:', users);
      return users;
    } catch (error) {
      console.error('Error in searchUsers:', error);
      throw error;
    }
  }

  async getUserOnlineStatus(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          lastSeen: true,
        },
      });

      if (!user || !user.lastSeen) {
        return { isOnline: false, lastSeen: null };
      }

      // Check if user was active in the last 1 minute
      const lastSeen = new Date(user.lastSeen);
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000); // 1 minute
      
      const isOnline = lastSeen > oneMinuteAgo;
      
      return {
        isOnline,
        lastSeen: user.lastSeen
      };
    } catch (error) {
      console.error('Error checking user online status:', error);
      return { isOnline: false, lastSeen: null };
    }
  }

  async updateLastSeen(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        lastSeen: new Date(),
      } as Prisma.UserUpdateInput,
    });
  }
} 