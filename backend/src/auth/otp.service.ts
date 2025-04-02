import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  generateOtp(): string {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(email: string, otp: string): Promise<void> {
    // OTP expires in 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Get user's name and update with OTP
    const user = await this.prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry: expiresAt,
      },
      select: {
        fullname: true,
        email: true,
      },
    });

    // Send OTP via email
    try {
      await this.mailService.sendOtpEmail(
        user.email,
        otp,
        user.fullname || 'User'
      );
      console.log('OTP email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email. Please try again.');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.otp || !user.otpExpiry) {
      return false;
    }

    if (user.otp !== otp) {
      return false;
    }

    if (user.otpExpiry < new Date()) {
      return false;
    }

    // Clear the OTP after successful verification
    await this.prisma.user.update({
      where: { email },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });

    return true;
  }
}
