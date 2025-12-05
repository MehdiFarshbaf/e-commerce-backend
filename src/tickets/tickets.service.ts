import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { IsNull, Repository } from 'typeorm';
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
      replyToTicket = await this.ticketRepository.findOne({
        where: { id: replyTo },
        relations: ['replyTo'],
      });
      if (replyToTicket && replyToTicket.replyTo)
        throw new BadRequestException('شما نمیتوانید این تیکت را ریپلای کنید.');
    }

    const ticket = this.ticketRepository.create({
      ...ticketData,
      user,
      replyTo: replyToTicket,
    });

    return await this.ticketRepository.save(ticket);
  }

  async findAll(): Promise<Ticket[]> {
    // const tickets = await this.ticketRepository
    //   .createQueryBuilder('ticket')
    //   .where('ticket.replyToId IS NULL')
    //   .getMany();
    const tickets = await this.ticketRepository.find({
      where: { replyTo: IsNull() },
      select: {
        id: true,
        title: true,
        subject: true,
        description: true,
      },
    });
    return tickets;
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOne({
      where: { id },
      relations: ['replies'],
    });
    if (!ticket) {
      new NotFoundException('تیکتی با این سناسه یافت نشد.');
    }
    return ticket;
  }
}
