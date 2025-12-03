import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
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
}
