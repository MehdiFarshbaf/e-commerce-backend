import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'create.user',
    description: 'name for permission',
  })
  @IsString({ message: 'نام مجوز باید متن باشد.' })
  @IsNotEmpty({ message: 'نام مجوز الزامی است.' })
  name: string;
}
