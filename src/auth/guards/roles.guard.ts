import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import RoleEnum from '../../users/enums/userRoleEnum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get roles in metadata
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();

    const hasRole = requiredRoles.includes(user.role);
    console.log('user role is : ', user.role);

    if (!hasRole)
      throw new ForbiddenException('شما اجازه ی دسترسی به این مسیر رو ندارید.');
    return true;
  }
}
