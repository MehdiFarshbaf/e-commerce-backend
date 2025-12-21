import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import Role from './enums/userRoleEnum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const alreadyUser = await this.findUserByMobile(createUserDto.mobile);
      if (alreadyUser) {
        throw new BadRequestException(
          'کاربری با این شماره موبایل ثبت نام کرده داریم.',
        );
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(role?: Role, limit: number = 10, page: number = 1) {
    const query = this.userRepository.createQueryBuilder('users');

    if (role) {
      query.where('role = :role', { role });
    }

    query.skip((page - 1) * limit).take(limit);

    return await query.getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new BadRequestException('کاربری با این شناسه یافت نشد.');
    return user;
  }

  async findUserByMobile(mobile: string, checkExit: boolean = false) {
    const user = await this.userRepository.findOneBy({ mobile });
    if (!user && checkExit)
      throw new BadRequestException('کاربری با این شماره موبایل یافت نشد.');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    try {
      console.log(updateUserDto);
      await this.userRepository.update(id, updateUserDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('User does not exist');
    }
  }
}
