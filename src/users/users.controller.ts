import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Response } from 'express';
import UserRoleEnum from './enums/userRoleEnum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const newUser = await this.usersService.create(createUserDto);

    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'User created',
      statusCode: HttpStatus.CREATED,
      data: newUser,
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('role') role?: UserRoleEnum,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const users = await this.usersService.findAll(role, limit, page);
    res.status(HttpStatus.OK).json({
      status: 'success',
      data: users,
      message: 'Users found',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
