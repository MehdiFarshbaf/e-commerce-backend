import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import type { Response } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto, @Res() res: Response) {
    const newTicket = await this.ticketsService.create(createTicketDto);
    res.status(HttpStatus.CREATED).send({
      success: true,
      message: 'تیکت با موفقیت ثبت شد.',
      data: newTicket,
    });
  }

  @Get()
  async getAllTickets(@Res() res: Response) {
    const ticket = await this.ticketsService.findAll();
    res.status(HttpStatus.OK).json({
      success: true,
      data: ticket,
      message: 'لیست تیکت ها',
    });
  }

  @Get(':id')
  async getTicket(@Param('id') id, @Res() res: Response) {
    const ticket = await this.ticketsService.findOne(+id);
    res.status(HttpStatus.OK).send({
      success: true,
      data: ticket,
      message: 'تیکت مورد نظر یافت شد.',
    });
  }
}
