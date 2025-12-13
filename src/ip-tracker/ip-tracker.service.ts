import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpRecord } from './entities/ip-record.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUESTS = 10;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 1;

  constructor(
    @InjectRepository(IpRecord)
    private readonly ipRepository: Repository<IpRecord>,
  ) {}

  async track(ip: string) {
    const nowTime = new Date();
    const record = await this.ipRepository.findOne({ where: { ip } });
    if (!record) {
      const newRecord = this.ipRepository.create({
        ip,
        requestCount: 1,
        windowStart: nowTime,
        isBlocked: false,
        blockUntil: null,
      });
      await this.ipRepository.save(newRecord);
      console.log(`Record created: ${ip}`);
      return;
    }
    const windowEnd = new Date(
      record.windowStart.getTime() + this.WINDOW_MINUTES * 60 * 1000,
    );
  }
}
