import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'مقدار استان باید رشته باشد.' })
  @IsNotEmpty({ message: 'مقدار استان الزامی است.' })
  province: string;

  @IsString({ message: 'شهر باید یک متن باشد.' })
  @IsNotEmpty({ message: 'شهر الزامی است.' })
  city: string;

  @IsString({ message: 'کدپستی باید متن باشد.' })
  @IsNotEmpty({ message: 'کدپستی الزامی است.' })
  postal_code: string;

  @IsString({ message: 'آدرس باید متن باشد.' })
  @IsNotEmpty({ message: 'آدرس الزامی است.' })
  address: string;

  @IsString({ message: 'موبایل گیرنده باید متن باشد.' })
  @IsNotEmpty({ message: 'موبایل گیرنده الزامی است.' })
  receiver_mobile: string;

  @IsOptional()
  @IsString({ message: 'توضیحات باید متنی باشد.' })
  description?: string;
}
