import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Response } from 'express';
import UserRoleEnum from './enums/userRoleEnum';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// import { plainToClass } from 'class-transformer';

@ApiTags('Users - مدیریت کاربران')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @ApiOperation({ summary: 'Create a new user' })
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

  @ApiOperation({ summary: 'Get all users (with optional role filter, pagination)' })
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

  @ApiOperation({ summary: 'Get a user by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOne(+id);
    res.status(HttpStatus.OK).json({
      status: 'success',
      data: user,
      message: 'User found',
    });
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    // const newBody = plainToClass(UpdateUserDto, updateUserDto, {
    //   excludeExtraneousValues: true,
    // });

    const user = await this.usersService.update(+id, updateUserDto);
    res.status(HttpStatus.OK).json({
      status: 'success',
      data: user,
      message: 'User updated',
    });
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.usersService.remove(+id);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'User removed',
      data: null,
    });
  }
}
