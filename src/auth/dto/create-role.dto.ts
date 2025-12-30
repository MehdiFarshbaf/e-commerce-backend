import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'create.user',
    description: 'name for role',
  })
  @IsString({ message: 'نام مجوز باید متن باشد.' })
  @IsNotEmpty({ message: 'نام مجوز الزامی است.' })
  name: string;
}
