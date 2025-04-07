import { Controller, Get, Query, UseGuards, Req, Post, UnauthorizedException, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from './users.service';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private prisma: PrismaService, private readonly usersService: UsersService) {}

  @Get('search')
  async searchUsers(@Query('query') query: string, @Req() req: Request & { user: User }) {
    console.log('Search query:', query);
    console.log('Current user:', req.user);

    if (!query || query.length < 2 || !req.user?.id) {
      return { users: [] };
    }

    try {
      const users = await this.usersService.searchUsers(query, req.user.id);
      console.log('Search results:', users);
      
      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          fullname: user.fullname
        }))
      };
    } catch (error) {
      console.error('Search error:', error);
      return { users: [] };
    }
  }

  @Get(':id/status')
  async getUserStatus(@Param('id') userId: string) {
    try {
      const status = await this.usersService.getUserOnlineStatus(userId);
      return status;
    } catch (error) {
      console.error('Error getting user status:', error);
      return { isOnline: false, lastSeen: null };
    }
  }

  @Post('update-last-seen')
  async updateLastSeen(@Req() req: Request & { user: User }) {
    if (!req.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.usersService.updateLastSeen(req.user.id);
  }
}