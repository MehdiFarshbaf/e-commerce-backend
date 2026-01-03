import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { I18nService } from 'nestjs-i18n';
import { CreateRoleDto } from './dto/create-role.dto';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';
import { CreatePermissionsDto } from './dto/create-permissions.dto';
import { AddPermissionToRoleDto } from './dto/add-permission-to-role.dto';
import { AddPermissionToUserDto } from './dto/add-permission-to-user.dto';

// @Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'register user' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const registerData = await this.authService.register(body);

    return {
      message: 'User registered',
      data: registerData,
    };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'login user' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const loginData = await this.authService.login(body);
    return {
      message: this.i18n.t('auth.login'),
      data: loginData,
    };
  }

  @ApiBearerAuth()
  @Post('role')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'create role' })
  async newRole(@Body() bode: CreateRoleDto) {
    const newRole = await this.authService.createRole(bode.name);
    return {
      message: 'created role',
      data: newRole,
    };
  }

  @ApiBearerAuth()
  @Post('role/append-to-user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'append role to user' })
  async addRoleToUser(@Body() addRoleToUserDto: AddRoleToUserDto) {
    const newRole = await this.authService.addRoleToUser(
      addRoleToUserDto.userId,
      addRoleToUserDto.roleId,
    );
    return {
      message: 'created role',
      data: newRole,
    };
  }

  @ApiBearerAuth()
  @Post('role/remove-from-user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'remove role from user' })
  async removeRoleFromUser(@Body() addRoleToUserDto: AddRoleToUserDto) {
    const newRole = await this.authService.removeRoleFromUser(
      addRoleToUserDto.userId,
      addRoleToUserDto.roleId,
    );
    return {
      message: 'remove role',
      data: newRole,
    };
  }

  @ApiBearerAuth()
  @Post('permission/append-to-role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add permission to role' })
  async addPermissionToRole(
    @Body() addPermissionToRoleDto: AddPermissionToRoleDto,
  ) {
    const newRole = await this.authService.addPermissionToRole(
      addPermissionToRoleDto.roleId,
      addPermissionToRoleDto.permissionId,
    );
    return {
      message: 'remove role',
      data: newRole,
    };
  }

  @ApiBearerAuth()
  @Post('permission/append-to-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add permission to user' })
  async addPermissionToUser(
    @Body() addPermissionToUserDto: AddPermissionToUserDto,
  ) {
    const newRole = await this.authService.addPermissionToUser(
      addPermissionToUserDto.userId,
      addPermissionToUserDto.permissionId,
    );
    return {
      message: 'permission has added to user',
      data: newRole,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user roles' })
  @Get('role/get-user-roles/:user_id')
  @HttpCode(HttpStatus.OK)
  async getUserRoles(@Param('user_id') user_id: number) {
    const userRoles = await this.authService.getUserRoles(user_id);
    return {
      message: 'user roles',
      data: userRoles,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create permission(s)',
    description:
      'Create one or multiple permissions. Accepts either a single permission name or an array of permission names.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Permission(s) created successfully',
    schema: {
      example: {
        success: true,
        message: 'Permissions created successfully',
        data: [
          { id: 1, name: 'create.user' },
          { id: 2, name: 'delete.user' },
        ],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Permission(s) already exist',
  })
  @Post('permission')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(@Body() createPermissionsDto: CreatePermissionsDto) {
    const permissions = await this.authService.createPermissions(
      createPermissionsDto.name,
    );

    const isArray = Array.isArray(createPermissionsDto.name);
    const count = isArray ? (permissions as any[]).length : 1;

    return {
      message: `${count} permission${count > 1 ? 's' : ''} created successfully`,
      data: permissions,
    };
  }
}
