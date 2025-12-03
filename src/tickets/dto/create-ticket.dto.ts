import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  userId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsOptional()
  @IsString({ message: 'توضیحات باید متنی باشد.' })
  description?: string;

  @IsOptional()
  replyTo: number;
}
