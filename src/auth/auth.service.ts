import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import UserRoleEnum from '../users/enums/userRoleEnum';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.userService.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRoleEnum.Normal_User,
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
      };
      const token = this.jwtService.sign(payload);
      return { accessToken: token };
    }
  }
}
