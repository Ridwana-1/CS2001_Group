import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';

@Injectable()
export class UpdateLastSeenMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request & { user?: User }, res: Response, next: NextFunction) {
    if (req.user?.id) {
      await this.usersService.updateLastSeen(req.user.id);
    }
    next();
  }
} 