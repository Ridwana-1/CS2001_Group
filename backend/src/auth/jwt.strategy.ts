/**
 * JwtStrategy
 * @author Sultan Jurabekov
 * @functionality JWT strategy that handles:
 * - JWT token validation
 * - User authentication
 * - Token payload extraction
 * - User context management
 * - Guard integration
 * @created February 8, 2024
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret', // Фикс
    });
  }

  async validate(payload: any) {
    return await this.authService.validateUserByPayload(payload);
  }
}
