import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import {
  RequestPayload,
  RequestUser,
} from '../common/interfaces/request-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
  }

  // این متد بعد از تأیید توکن اجرا می‌شه
  // payload همون چیزیه که موقع sign کردن توکن گذاشتی (مثلاً { sub: userId, email: '...' })
  // async validate(payload: any): Promise<User> {
  validate(payload: RequestPayload): RequestUser {
    // const user = await this.usersService.findOneById(payload.sub);

    // if (!user) {
    //   throw new UnauthorizedException('کاربر یافت نشد یا دسترسی معتبر نیست');
    // }

    // اگر کاربر غیرفعال شده بود
    // if (user.isActive === false) {
    //   throw new UnauthorizedException('حساب کاربری غیرفعال است');
    // }

    // این چیزیه که داخل request.user قرار می‌گیره
    // return user;
    return {
      userId: payload.sub,
      mobile: payload.mobile,
      display_name: payload.display_name,
      role: payload.role,
    };
  }
}
