import Role from '../enums/userRoleEnum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '09039067633', description: 'mobile number' })
  @IsString({ message: 'موبایل باید متن باشد.' })
  @IsNotEmpty({ message: 'موبایل الزامی است.' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد.' })
  @Transform(({ value }) => (value as string).trim())
  mobile: string;

  @ApiProperty({ example: "Mehdi Farshabf", description: "display name" })
  @IsString({ message: 'نام باید متن باشد.' })
  @IsNotEmpty({ message: 'وارد کردن نام الزامی است.' })
  display_name: string;

  @ApiProperty({ example: 'Mehdi14439', description: 'password' })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'گذرواژه حداقل باید 8 کاراکتر باشد.' })
  password: string;

  @ApiPropertyOptional({
    enum: Role,
    enumName: 'UserRoleEnum', // اختیاری اما توصیه می‌شه برای وضوح بیشتر
    example: Role.Normal_User, // معمولاً کاربر معمولی پیش‌فرض بهتریه
    description: 'Role of the user. Default is "user" if not provided.',
    default: Role.Normal_User, // اگر در سرویس پیش‌فرض user هست، اینجا هم نشون بده
  })
  @IsEnum(Role, {
    message: 'مقدار role باید یکی از مقادیر admin یا user باشد.',
  })
  @IsOptional()
  role: Role;
}
