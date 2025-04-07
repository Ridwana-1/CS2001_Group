import { Module, Logger } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';
import * as fs from 'fs';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MailModule');
        const templateDir = join(__dirname, 'templates');
        
        logger.log('Initializing MailModule');
        logger.log(`Template directory: ${templateDir}`);
        
        // Check if template directory exists
        if (!fs.existsSync(templateDir)) {
          logger.error(`Template directory does not exist: ${templateDir}`);
          throw new Error(`Template directory not found: ${templateDir}`);
        }
        
        // Check if OTP template exists
        const otpTemplatePath = join(templateDir, 'otp.hbs');
        if (!fs.existsSync(otpTemplatePath)) {
          logger.error(`OTP template not found: ${otpTemplatePath}`);
          throw new Error(`OTP template not found: ${otpTemplatePath}`);
        }
        
        logger.log('Email configuration:', {
          host: 'smtp.gmail.com',
          port: 587,
          user: configService.get('EMAIL_USER'),
        });
        
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: configService.get('EMAIL_USER'),
              pass: configService.get('EMAIL_PASS'),
            },
          },
          defaults: {
            from: `"Chat App" <${configService.get('EMAIL_USER')}>`,
          },
          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}