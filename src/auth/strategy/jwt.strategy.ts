/* eslint-disable */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import console from 'console';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const admin = await this.prisma.admin.findFirst({
      where: { email: payload.email },
    });
    const clinic = await this.prisma.clinic.findFirst({
      where: { email: payload.email },
    });

    const user = await this.prisma.user.findFirst({
      where: { email: payload.email },
    });

    if (!admin && !clinic && !user) throw new UnauthorizedException();
    return payload;
  }
}
