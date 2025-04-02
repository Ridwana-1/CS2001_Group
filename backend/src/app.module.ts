import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '../prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MailService } from './mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ChannelModule } from './channel/channel.module';
import { UpdateLastSeenMiddleware } from './middleware/update-last-seen.middleware';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 60,
            limit: 10,
          },
        ],
      }),
    }),
    UserModule,
    AuthModule,
    UsersModule,
    ChatModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: `"Chat App" <${process.env.EMAIL_USER}>`,
      },
      template: {
        dir: join(__dirname, 'mail', 'templates'),
        adapter: require('handlebars'),
        options: {
          strict: true,
        },
      },
    }),
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, MailService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UpdateLastSeenMiddleware)
      .forRoutes('*');
  }
}