import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>(ROLE_KEY, context.getHandler()) || [];

    if (!requiredRoles.length) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('User missing in request');

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient role permission');
    }

    return true;
  }
}
