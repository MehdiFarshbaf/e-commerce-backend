import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import RoleEnum from '../enums/userRoleEnum';

export class UpdateUserDto {
  @IsString({ message: 'نام باید متن باشد.' })
  @IsNotEmpty({ message: 'وارد کردن نام الزامی است.' })
  display_name: string;

  @IsEnum(RoleEnum, {
    message: 'مقدار role باید یکی از مقادیر admin یا user باشد.',
  })
  @IsOptional()
  role: RoleEnum;
}
