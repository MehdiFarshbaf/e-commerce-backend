import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddPermissionToRoleDto {
  @ApiProperty({
    example: 1,
    description: 'role id',
  })
  @IsNotEmpty({ message: 'شناسه نقش الزامی است.' })
  roleId: number;

  @ApiProperty({
    example: 1,
    description: 'permission id',
  })
  @IsNotEmpty({ message: 'شناسه مجوز الزامی است.' })
  permissionId: number;
}
