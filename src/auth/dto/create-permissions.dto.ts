import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  ArrayNotEmpty,
  ArrayUnique,
  ValidateIf,
  Matches,
} from 'class-validator';

export class CreatePermissionsDto {
  @ApiProperty({
    description: 'Permission name or array of permission names',
    example: 'create.user',
    oneOf: [
      { type: 'string', example: 'create.user' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['create.user', 'delete.user'],
      },
    ],
  })
  @Transform(({ value }: { value: unknown }): string | string[] => {
    // اگر آرایه است، trim کن و duplicates را حذف کن
    if (Array.isArray(value)) {
      const trimmed = value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter((item) => item !== '');
      return [...new Set(trimmed)];
    }
    // اگر string است، trim کن
    if (typeof value === 'string') {
      return value.trim();
    }
    return value as string | string[];
  })
  @ValidateIf((o: CreatePermissionsDto) => typeof o.name === 'string')
  @IsString({ message: 'Permission name must be a string' })
  @IsNotEmpty({ message: 'Permission name cannot be empty' })
  @Matches(/^[a-z]+(\.[a-z]+)*$/, {
    message:
      'Permission name must be in format: action.resource (e.g., create.user)',
  })
  @ValidateIf((o: CreatePermissionsDto) => Array.isArray(o.name))
  @IsArray({ message: 'Permission names must be an array' })
  @ArrayNotEmpty({ message: 'Permission names array cannot be empty' })
  @ArrayUnique({ message: 'Permission names must be unique' })
  @IsString({ each: true, message: 'Each permission name must be a string' })
  @Matches(/^[a-z]+(\.[a-z]+)*$/, {
    each: true,
    message:
      'Each permission name must be in format: action.resource (e.g., create.user)',
  })
  name: string | string[];
}
