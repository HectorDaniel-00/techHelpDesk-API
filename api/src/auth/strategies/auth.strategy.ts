import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PayloadAuthDto } from '../dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from 'src/users/entities/user.repository';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private readonly userService: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_PRIVATE_SECRET') as string,
    });
  }

  async validate(payload: PayloadAuthDto): Promise<PayloadAuthDto> {
    const id = payload.sub;
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  }
}
