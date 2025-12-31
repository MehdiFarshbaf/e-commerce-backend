import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
    description: 'name for role',
  })
  @IsString({ message: 'نام نقش باید متن باشد.' })
  @IsNotEmpty({ message: 'نام نقش الزامی است.' })
  name: string;
}
