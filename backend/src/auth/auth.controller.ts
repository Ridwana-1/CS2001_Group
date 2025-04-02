import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  HttpStatus,
  Put,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';

/**
 * Authentication Controller
 * Handles all authentication-related endpoints including:
 * - Google OAuth authentication
 * - User registration
 * - User login
 * - Profile management
 * - Authentication verification
 */

// Add interface for login DTO
interface LoginDto {
  email: string;
  password: string;
}

// Add interface for update profile DTO
interface UpdateProfileDto {
  fullname?: string;
  avatar?: string;  // This will map to avatarUrl in the Profile model
  bio?: string;
}

// Add interface for authenticated request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    fullname: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Google OAuth login endpoint
   * Initiates the Google OAuth flow
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // This route initiates the Google OAuth flow
    // The actual logic is handled by the GoogleStrategy
  }

  /**
   * Google OAuth callback endpoint
   * Handles the callback from Google OAuth
   */
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'No user from google' });
    }

    try {
      // Handle Google login and get token
      const result = await this.authService.googleLogin(req);

      // Redirect to frontend with token
      const frontendUrl = 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/dashboard?token=${result.access_token}`;
      
      // Используем 302 для временного редиректа
      res.status(302).redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth redirect error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * User registration endpoint
   */
  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('fullname') fullname: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(email, fullname, password);
  }

  /**
   * User login endpoint
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Request OTP for passwordless login
   */
  @Post('request-otp')
  async requestOtp(@Body('email') email: string) {
    return this.authService.requestOtp(email);
  }

  /**
   * Verify OTP for passwordless login
   */
  @Post('verify-otp')
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.verifyOtp(email, otp);
  }

  /**
   * Update user profile
   * Protected route - requires authentication
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  /**
   * Get current user profile
   * Protected route - requires authentication
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: AuthenticatedRequest) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Проверяем валидность сессии
    const isValidSession = await this.authService.validateUserSession(token, req.user.id);
    if (!isValidSession) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return req.user;
  }

  /**
   * Logout user
   * Protected route - requires authentication
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: AuthenticatedRequest) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await this.authService.deactivateUserSession(token);
    }
    return { message: 'Logged out successfully' };
  }

  @Post('request-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.otp,
      resetPasswordDto.newPassword,
    );
  }
}
