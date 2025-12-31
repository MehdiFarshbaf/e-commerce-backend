import {
  BadRequestException,
  ConflictException,
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
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Role } from './entities/role.entity';
import { RequestPayload } from './common/interfaces/request-user.interface';
import { User } from '../users/entities/user.entity';
import { Permission } from './entities/permission.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
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
      const payload: RequestPayload = {
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

    // if (!user.roles.includes((r) => r.id === role.id)) {
    //   return await this.userService.addRole(userId, role);
    // }

    // throw new BadRequestException('این نقش قبلا به کاربر اضافه شده است.');

    if (user.roles.some((r) => r.id === role.id)) {
      throw new BadRequestException('این نقش قبلاً به کاربر اضافه شده است');
    }

    // اضافه کردن نقش
    return await this.userService.addRole(userId, role);
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    const user = await this.userService.findUserByPermission(userId);

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('نقشی با این شناسه یافت نشد.');

    if (user.roles.find((r) => r.id === role.id)) {
      return await this.userService.removeRole(userId, role.id);
    }

    throw new BadRequestException('نقش وارد شده معتبر نمیباشد.');
  }

  async getUserRoles(userId: number): Promise<User> {
    const user = await this.userService.findUserByPermission(userId);
    return user;
  }

  /**
   * ایجاد یک یا چند permission جدید
   * @param input string → یک permission
   *        string[] → چندین permission
   */
  async createPermissions(
    name: string | string[],
  ): Promise<Permission | Permission[]> {
    const permissionNames = Array.isArray(name) ? name : [name];

    // بررسی خالی نبودن آرایه
    if (permissionNames.length === 0) {
      throw new BadRequestException('At least one permission name is required');
    }

    // Trim و حذف مقادیر خالی
    const trimmedNames = permissionNames
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (trimmedNames.length === 0) {
      throw new BadRequestException('Permission names cannot be empty');
    }

    // حذف duplicates
    const uniqueNames = [...new Set(trimmedNames)];

    // بررسی وجود permissions تکراری در دیتابیس
    const existingPermissions = await this.permissionRepository.find({
      where: { name: In(uniqueNames) },
    });

    if (existingPermissions.length > 0) {
      const existingNames = existingPermissions.map((p) => p.name);
      throw new ConflictException(
        `The following permissions already exist: ${existingNames.join(', ')}`,
      );
    }

    // ساخت permissions جدید
    const newPermissions = uniqueNames.map((permissionName) =>
      this.permissionRepository.create({ name: permissionName }),
    );

    // ذخیره در دیتابیس
    const savedPermissions =
      await this.permissionRepository.save(newPermissions);

    // اگر ورودی تکی بود، فقط یک شی برگردان
    return Array.isArray(name) ? savedPermissions : savedPermissions[0];
  }
}
