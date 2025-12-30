import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddRoleToUserDto {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @IsNotEmpty({ message: 'شناسه کاربر الزامی است.' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'role id',
  })
  @IsNotEmpty({ message: 'شناسه نقش الزامی است.' })
  roleId: number;
}
