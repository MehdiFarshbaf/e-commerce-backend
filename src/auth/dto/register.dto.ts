import {
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString({ message: 'موبایل باید متن باشد.' })
  @IsNotEmpty({ message: 'موبایل الزامی است.' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد.' })
  @Transform(({ value }) => (value as string).trim())
  mobile: string;

  @IsString({ message: 'نام باید متن باشد.' })
  @IsNotEmpty({ message: 'وارد کردن نام الزامی است.' })
  display_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'گذرواژه حداقل باید 8 کاراکتر باشد.' })
  @MaxLength(16, { message: 'گذرواژه حداکثر باید 16 کاراکتر باشد.' })
  password: string;
}
