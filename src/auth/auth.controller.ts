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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { I18nService } from 'nestjs-i18n';
import { CreateRoleDto } from './dto/create-role.dto';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';

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
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
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
      success: true,
      message: 'remove role',
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
      success: true,
      message: 'user roles',
      data: userRoles,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create permission' })
  @Post('permission')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.authService.createPermission(
      createPermissionDto.name,
    );
    return {
      success: true,
      message: 'create permission successfully',
      data: permission,
    };
  }

  // @HttpCode(HttpStatus.OK)
  // @Get('/getUserPermission/:userId')
  // async getUserPermissions(@Param('userId') userId: number) {
  //   const user = await this.authService.getUserPermissions(userId);
  //   return user;
  // }
}
