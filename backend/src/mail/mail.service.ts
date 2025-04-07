/**
 * MailService
 * @author Sultan Jurabekov
 * @functionality Email service that handles:
 * - Email template management
 * - SMTP configuration
 * - Email sending operations
 * - OTP email delivery
 * - Error handling and logging
 * @created February 8, 2024
 */

import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';

interface EmailError {
  message: string;
  stack?: string;
  code?: string;
  command?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {
    this.logger.log('MailService initialized');
    this.logger.log(`Current directory: ${__dirname}`);
    this.logger.log(`Template path: ${join(__dirname, 'templates', 'otp.hbs')}`);
  }

  async sendOtpEmail(email: string, otp: string, name: string) {
    try {
      this.logger.log(`Attempting to send OTP email to ${email}`);
      this.logger.log(`Template path: ${join(__dirname, 'templates', 'otp.hbs')}`);
      this.logger.log(`SMTP config: ${JSON.stringify({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM_EMAIL
      }, null, 2)}`);
      
      const result = await this.mailerService.sendMail({
        to: email,
        subject: 'Your OTP Code',
        template: 'otp',
        context: {
          otp,
          name,
        },
      });

      this.logger.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      const emailError = error as EmailError;
      this.logger.error('Failed to send email:', error);
      this.logger.error('Error details:', {
        message: emailError.message,
        stack: emailError.stack,
        code: emailError.code,
        command: emailError.command,
      });
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        resetUrl,
      },
    });
  }

  async sendNewMessageNotification(email: string, sender: string, messageContent: string) {
    const chatLink = `http://localhost:3000/chat?user=${sender}`; // Замените на ваш URL

    await this.mailerService.sendMail({
      to: email,
      subject: 'New Message Notification',
      template: './new-message', // This assumes you have a new-message.hbs template
      context: {
        sender,
        messageContent,
        chatLink,
      },
    });
  }
}