import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn()
  created_at: Date;
}
