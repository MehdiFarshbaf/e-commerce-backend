import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { I18nService } from 'nestjs-i18n';
import { CreateRoleDto } from './dto/create-role.dto';

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

  // @HttpCode(HttpStatus.OK)
  // @Get('/getUserPermission/:userId')
  // async getUserPermissions(@Param('userId') userId: number) {
  //   const user = await this.authService.getUserPermissions(userId);
  //   return user;
  // }
}
