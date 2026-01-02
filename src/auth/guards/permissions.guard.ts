import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RequestUser } from '../common/interfaces/request-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    console.log('permission guard is running ...');
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermissions) return true;

    // get user data
    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user: RequestUser }>();
    const userId = user.userId;

    const userPermissions = await this.authService.getUserPermissions(userId);

    const hasPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermissions)
      throw new ForbiddenException('شما مجوز لازم برای این عملیات رو ندارید.');

    return true;
  }

  private cleanOwn(str: string): string {
    if (str.endsWith('.own')) {
      console.log('clean');
    }
    return str;
  }
}
