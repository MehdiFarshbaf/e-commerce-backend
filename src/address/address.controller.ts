import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import type { Response } from 'express';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @Res() res: Response,
  ) {
    const newAddress = await this.addressService.create(createAddressDto);
    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'آدرس با موفقیت ایجاد شد.',
      data: newAddress,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const addresses = await this.addressService.findAll();
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'لیست آدرس ها با موفقیت دریافت شد.',
      data: addresses,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const address = await this.addressService.findOne(+id);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'آدرس مورد نظر یافت شد.',
      data: address,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Res() res: Response,
  ) {
    const address = await this.addressService.update(+id, updateAddressDto);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'ویرایش آدرس موفقیت آمیز بود.',
      data: address,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.addressService.remove(+id);
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'آدرس مورد نظر با موفقیت حذف شد.',
      data: null,
    });
  }
}
