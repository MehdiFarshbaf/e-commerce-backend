import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UsersService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { userId, replyTo, ...ticketData } = createTicketDto;
    const user = await this.userService.findOne(userId);

    let replyToTicket: Ticket | null = null;
    if (replyTo) {
      try {
        replyToTicket = await this.ticketRepository.findOneByOrFail({
          id: replyTo,
        });
      } catch (error) {
        throw new NotFoundException(`تیکت والد با شناسه ${replyTo} یافت نشد.`);
      }
    }

    const ticket = this.ticketRepository.create({
      ...ticketData,
      user,
      replyTo: replyToTicket,
    });

    return await this.ticketRepository.save(ticket);
  }
}
