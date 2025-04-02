/**
 * Prisma Service
 * @author Sultan Jurabekov
 * @functionality Database service that handles:
 * - Database connection management
 * - Prisma client initialization
 * - Database schema management
 * - Data migration handling
 * - Connection pooling
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
} 