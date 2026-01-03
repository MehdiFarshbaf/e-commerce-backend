import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from '../auth/decorators/permissions.decorator';
@ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createAddressDto: CreateAddressDto) {
    const newAddress = await this.addressService.create(createAddressDto);
    return {
      message: 'آدرس جدید ایجاد شد.',
      data: newAddress
    }
  }

  @Get()
  async findAll() {
    const addresses = await this.addressService.findAll();
    return addresses
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const address = await this.addressService.findOne(+id);
    return address
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    const address = await this.addressService.update(+id, updateAddressDto);
    return address
  }

  @Permissions('address.delete')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.addressService.remove(+id);
    return { data: "ok" }
  }
}
