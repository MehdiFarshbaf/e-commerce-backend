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
import RoleEnum from '../enums/userRoleEnum';
import { Address } from '../../address/entities/address.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Role as RoleEntity } from './../../auth/entities/role.entity';
import { Permission } from '../../auth/entities/permission.entity';

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
    enum: RoleEnum,
    default: RoleEnum.Normal_User,
  })
  role: RoleEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @ManyToMany(() => RoleEntity)
  @JoinTable({ name: 'user_roles' })
  roles: RoleEntity[];

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'user_permissions' })
  permissions: Permission[];
}
