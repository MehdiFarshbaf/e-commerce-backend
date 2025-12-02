import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import UserRoleEnum from '../enums/userRoleEnum';

export class UpdateUserDto {
  @IsString({ message: 'نام باید متن باشد.' })
  @IsNotEmpty({ message: 'وارد کردن نام الزامی است.' })
  display_name: string;

  @IsEnum(UserRoleEnum, {
    message: 'مقدار role باید یکی از مقادیر admin یا user باشد.',
  })
  @IsOptional()
  role: UserRoleEnum;
}
