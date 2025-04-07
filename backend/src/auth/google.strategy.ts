/**
 * GoogleStrategy
 * @author Sultan Jurabekov
 * @functionality Google OAuth strategy that handles:
 * - Google authentication flow
 * - User profile extraction
 * - Token management
 * - Session creation
 * - OAuth callback processing
 * @created February 8, 2024
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', ''),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', ''),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL', 'http://localhost:5500/auth/google/redirect'),
      scope: ['email', 'profile'],
    });

    // Дополнительная проверка
    if (!configService.get<string>('GOOGLE_CLIENT_ID')) {
      throw new Error('GOOGLE_CLIENT_ID is missing in environment variables');
    }
    if (!configService.get<string>('GOOGLE_CLIENT_SECRET')) {
      throw new Error('GOOGLE_CLIENT_SECRET is missing in environment variables');
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails?.[0]?.value || '',
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
      accessToken,
    };

    done(null, user);
  }
}
