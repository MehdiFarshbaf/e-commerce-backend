import UserRoleEnum from '../enums/userRoleEnum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString({ message: 'موبایل باید متن باشد.' })
  @IsNotEmpty({ message: 'موبایل الزامی است.' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد.' })
  @Transform(({ value }) => (value as string).trim())
  mobile: string;

  @IsString({ message: 'نام باید متن باشد.' })
  @IsNotEmpty({ message: 'وارد کردن نام الزامی است.' })
  display_name: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'گذرواژه حداقل باید 8 کاراکتر باشد.' })
  password: string;

  @IsEnum(UserRoleEnum, {
    message: 'مقدار role باید یکی از مقادیر admin یا user باشد.',
  })
  @IsOptional()
  role: UserRoleEnum;
}
