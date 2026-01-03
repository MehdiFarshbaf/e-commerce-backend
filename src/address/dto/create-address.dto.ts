import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: 7,
    description: 'user id',
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: 'تهران',
    description: 'province',
  })
  @IsString({ message: 'مقدار استان باید رشته باشد.' })
  @IsNotEmpty({ message: 'مقدار استان الزامی است.' })
  province: string;

  @ApiProperty({
    example: 'تهران',
    description: 'city',
  })
  @IsString({ message: 'شهر باید یک متن باشد.' })
  @IsNotEmpty({ message: 'شهر الزامی است.' })
  city: string;

  @ApiProperty({
    example: '1234567891',
    description: 'postal code',
  })
  @IsString({ message: 'کدپستی باید متن باشد.' })
  @IsNotEmpty({ message: 'کدپستی الزامی است.' })
  postal_code: string;

  @ApiProperty({
    example: 'ولنجک، خیابان سوم، پلاک 18',
    description: 'address',
  })
  @IsString({ message: 'آدرس باید متن باشد.' })
  @IsNotEmpty({ message: 'آدرس الزامی است.' })
  address: string;

  @ApiProperty({
    example: '09039067633',
    description: 'receiver mobile',
  })
  @IsString({ message: 'موبایل گیرنده باید متن باشد.' })
  @IsNotEmpty({ message: 'موبایل گیرنده الزامی است.' })
  receiver_mobile: string;

  @ApiPropertyOptional({
    example: 'محل کار',
    description: 'description',
  })
  @IsOptional()
  @IsString({ message: 'توضیحات باید متنی باشد.' })
  description?: string;
}
