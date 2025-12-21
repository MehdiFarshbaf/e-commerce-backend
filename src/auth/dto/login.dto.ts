import {
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '09039067633',
    description: 'شماره موبایل کاربر (ایرانی، 11 رقم شروع با 09)',
  })
  @IsString({ message: 'موبایل باید متن باشد.' })
  @IsNotEmpty({ message: 'موبایل الزامی است.' })
  @Length(11, 11, { message: 'شماره موبایل باید 11 رقم باشد.' })
  @Transform(({ value }) => (value as string).trim())
  mobile: string;

  @ApiProperty({ example: 'Mehdi14439', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'گذرواژه حداقل باید 8 کاراکتر باشد.' })
  @MaxLength(16, { message: 'گذرواژه حداکثر باید 16 کاراکتر باشد.' })
  password: string;
}
