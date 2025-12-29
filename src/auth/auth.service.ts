import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import Role from '../users/enums/userRoleEnum';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userService.create({
      ...registerDto,
      password: hashedPassword,
      role: Role.Normal_User,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByMobile(loginDto.mobile);
    if (user) {
      if (!(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException('رمز ورود شما اشتباه است.');
      }
      const payload = {
        mobile: user.mobile,
        sub: user.id,
        display_name: user.display_name,
        role: user.role,
      };
      const token = this.jwtService.sign(payload);
      return {
        accessToken: token,
        message: this.i18n.translate('auth.login'),
      };
    }
  }

  async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.userService.findUserByPermission(userId);
    const permissions = new Set<string>();
    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissions.add(permission.name);
      });
    });

    user.permissions?.forEach((permission) => {
      permissions.add(permission.name);
    });

    return Array.from(permissions);
  }
}
