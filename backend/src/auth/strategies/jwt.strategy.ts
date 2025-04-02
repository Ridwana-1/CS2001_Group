import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '92c2c7fa6c3672a476be56898d70cf112a473a106274abb05628c776e91c9ad7fbca004f00390eaf002649a2494c84d82648165d97c05ef8add8024b87c8df0a3ce0672c14496b84fcaf1a3771f104d4df4687ecb5f1d00ef88e7d45f97988a52723b592e86349fbf99e499f84ac275a4c72dd5e4dfaa59de5cc0d709445160ef4921e31112caa98c2275917fd8fa3b42ffcbff3d90b305b1bdb25e67ba4b702fd9d37ae69229dde854d45bc258cfefca7df7e2cbc8da2b99c158d56b1ae2b8966e2e11f20c483feb35d1c753c2c1857b3c3ddabd804539297e42cfb692e0797e66d9c8aed1bfe28e3b272044ade663921ebafe33df1cac23d4bf456e95d79f0', // Add fallback to avoid undefined
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}