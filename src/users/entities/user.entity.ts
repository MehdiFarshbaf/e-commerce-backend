import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Role from '../enums/userRoleEnum';
import { Address } from '../../address/entities/address.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Role: RoleEntity } from './../../auth/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 11 })
  mobile: string;

  @Column({ nullable: false })
  display_name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Normal_User,
  })
  role: Role;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  roles: RoleEntity[]

}
