import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    messages: any;
    otp: any;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
