import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/constants/key/decorator-public';
import { IS_ROLE_KEY } from 'src/constants/key/decorator-role';

export class AuthJwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isRole = this.reflector.getAllAndOverride<string>(IS_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isRole) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!isRole.includes(user.role)) {
      throw new ForbiddenException('No tienes permiso para esta accion');
    }

    if (isPublic) return true;
    return true;
  }
}
