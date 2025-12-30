import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import RoleEnum from '../users/enums/userRoleEnum';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userService.create({
      ...registerDto,
      password: hashedPassword,
      role: RoleEnum.Normal_User,
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

  async createRole(name: string): Promise<Role> {
    const role = this.roleRepository.create({ name });
    return this.roleRepository.save(role);
  }

  async addRoleToUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId);
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('نقشی با این شناسه یافت نشد.');
    if (!user.roles.includes((r) => r.id === role.id)) {
      return await this.userService.addRole(userId, role);
    }
    return false;
  }
}
