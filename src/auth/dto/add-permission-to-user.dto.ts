import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddPermissionToUserDto {
  @ApiProperty({
    example: 1,
    description: 'user id',
  })
  @IsNotEmpty({ message: 'شناسه کاربر الزامی است.' })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'permission id',
  })
  @IsNotEmpty({ message: 'شناسه مجوز الزامی است.' })
  permissionId: number;
}
