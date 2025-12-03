import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  province: string;
  @Column({ nullable: false })
  city: string;
  @Column({ nullable: false })
  address: string;
  @Column({ length: 10 })
  postal_code: string;
  @Column({ length: 11 })
  receiver_mobile: string;
  @Column({ nullable: true })
  description: string;
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
