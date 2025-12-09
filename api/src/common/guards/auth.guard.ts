import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/constants/key/decorator-public';

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) return true;

      if (!context) {
        throw new UnauthorizedException('Token required');
      }
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Expired token');
      }
      throw err;
    }
  }
}
