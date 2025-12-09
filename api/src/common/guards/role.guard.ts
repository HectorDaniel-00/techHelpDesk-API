import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/constants/key/decorator-role';

export class AuthRoleGuard {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('No tienes permiso para esta accion');
    }
    return true;
  }
}
