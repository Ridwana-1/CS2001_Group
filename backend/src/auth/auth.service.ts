/**
 * Authentication Service
 * @author Sultan Jurabekov
 * @functionality Authentication service that handles:
 * - User registration and login
 * - JWT token generation and validation
 * - Password hashing and verification
 * - OTP (One-Time Password) management
 * - Google OAuth integration
 * - Session management
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { OtpService } from './otp.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private mailService: MailService,
  ) {}

  /**
   * Handle Google OAuth login
   * Creates a new user if they don't exist or logs in existing user
   */
  async googleLogin(req: { user: any }) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const { email, firstName, lastName } = req.user;

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullname: `${firstName} ${lastName}`,
          password: '', // No password for OAuth users
          isGoogleUser: true,
        },
      });
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Create new session
    await this.createUserSession(user.id, token);

    // Deactivate other sessions
    await this.deactivateOtherUserSessions(user.id, token);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    };
  }

  /**
   * Register a new user
   */
  async register(email: string, fullname: string, password: string) {
    console.log('Attempting to register user:', { email, fullname });

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('Existing user check:', existingUser);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await this.prisma.user.create({
      data: {
        email,
        fullname,
        password: hashedPassword,
        isGoogleUser: false,
      },
    });

    console.log('User created successfully:', user);

    // Generate and send OTP
    const otp = this.otpService.generateOtp();
    await this.otpService.saveOtp(email, otp);

    return {
      message: 'Registration successful. Please check your email for OTP.',
      email: user.email,
    };
  }

  /**
   * Login a user
   */
  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.validateUserByEmail(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Create new session
    await this.createUserSession(user.id, token);

    // Deactivate other sessions
    await this.deactivateOtherUserSessions(user.id, token);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    };
  }

  /**
   * Validate user for local strategy (email + password)
   */
  async validateUserByEmail(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found. Please check your email or register.');
    }

    if (!user.password) {
      throw new UnauthorizedException('This account was created using Google. Please use Google Sign-In.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password. Please try again.');
    }

    return user;
  }

  /**
   * Validate user for JWT strategy
   */
  async validateUserByPayload(payload: any) {
    return await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, fullname: true },
    });
  }

  /**
   * Request OTP for passwordless login
   */
  async requestOtp(email: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate and save OTP
    const otp = this.otpService.generateOtp();
    await this.otpService.saveOtp(email, otp);

    // TODO: Send OTP via email
    console.log('Generated OTP:', otp); // For testing purposes

    return { message: 'OTP sent to your email' };
  }

  /**
   * Verify OTP for passwordless login
   */
  async verifyOtp(email: string, otp: string) {
    // Verify OTP
    const isValid = await this.otpService.verifyOtp(email, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Get user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    // Create new session
    await this.createUserSession(user.id, token);

    // Deactivate other sessions
    await this.deactivateOtherUserSessions(user.id, token);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateProfileDto: any) {
    // Update or create profile
    const profile = await this.prisma.profile.upsert({
      where: {
        userId: userId
      },
      create: {
        userId: userId,
        bio: updateProfileDto.bio,
        avatarUrl: updateProfileDto.avatar
      },
      update: {
        bio: updateProfileDto.bio,
        avatarUrl: updateProfileDto.avatar
      }
    });

    // Get updated user with profile
    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullname: updatedUser.fullname,
        avatar: updatedUser.profile?.avatarUrl,
        bio: updatedUser.profile?.bio
      }
    };
  }

  async requestPasswordReset(email: string) {
    console.log('Requesting password reset for email:', email);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('User found:', user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Генерируем и сохраняем OTP (email отправляется внутри saveOtp)
    const otp = this.otpService.generateOtp();
    console.log('Generated OTP:', otp);

    await this.otpService.saveOtp(email, otp);
    console.log('OTP saved and email sent');

    return { message: 'OTP sent successfully' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    console.log('Resetting password for email:', email);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    console.log('User found:', user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Проверяем OTP
    const isValid = await this.otpService.verifyOtp(email, otp);
    console.log('OTP verification result:', isValid);

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log('Password updated successfully');

    return { message: 'Password reset successfully' };
  }

  /**
   * Create a new user session
   */
  async createUserSession(userId: string, token: string, device?: string, ip?: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    return this.prisma.userSession.create({
      data: {
        userId,
        token,
        device,
        ip,
        expiresAt,
        isActive: true,
        lastUsed: new Date()
      },
    });
  }

  /**
   * Validate user session
   */
  async validateUserSession(token: string, userId: string): Promise<boolean> {
    const session = await this.prisma.userSession.findFirst({
      where: {
        token,
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (session) {
      // Update last used timestamp
      await this.prisma.userSession.update({
        where: { id: session.id },
        data: { lastUsed: new Date() },
      });
      return true;
    }

    return false;
  }

  /**
   * Deactivate user session
   */
  async deactivateUserSession(token: string) {
    await this.prisma.userSession.updateMany({
      where: { token },
      data: { isActive: false },
    });
  }

  /**
   * Deactivate all user sessions except current
   */
  async deactivateOtherUserSessions(userId: string, currentToken: string) {
    await this.prisma.userSession.updateMany({
      where: {
        userId,
        token: { not: currentToken },
      },
      data: { isActive: false },
    });
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions() {
    await this.prisma.userSession.updateMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
      data: { isActive: false },
    });
  }
}
