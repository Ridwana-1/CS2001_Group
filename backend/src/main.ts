import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

// Внутри async function bootstrap()
const configService = new ConfigService();
console.log('GOOGLE_CLIENT_ID:', configService.get('GOOGLE_CLIENT_ID'));
console.log('GOOGLE_SECRET:', configService.get('GOOGLE_CLIENT_SECRET'));
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  const port = 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`WebSocket server is running on: ws://localhost:${port}`);
}
bootstrap();