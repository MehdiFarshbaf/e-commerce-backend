import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IpRecord } from './entities/ip-record.entity'
import { Repository } from 'typeorm'

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUESTS = 4
  private readonly WINDOW_MINUTES = 1
  private readonly BLOCK_MINUTES = 2
  private readonly TEHRAN_TIMEZONE = 3.5 * 60 * 60 * 1000

  constructor (
    @InjectRepository(IpRecord)
    private readonly ipRepository: Repository<IpRecord>,
  ) {}

  async track (ip: string) {
    // now times
    const nowTime = new Date()
    const record = await this.ipRepository.findOne({ where: { ip } })

    // create first record
    if (!record) {
      const newRecord = this.ipRepository.create({
        ip,
        requestCount: 1,
        windowStart: nowTime,
        isBlocked: false,
        blockUntil: null,
      })
      await this.ipRepository.save(newRecord)
      console.log(`Record created: ${ip}`)
      return
    }

    // check blocked ip
    if (record.isBlocked && record.blockUntil && nowTime < record.blockUntil) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'To Many Requests',
          message: `شما برای ${this.BLOCK_MINUTES} دقیقه بلاک هستدید.`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    // calculate windowEnd
    const windowEnd = new Date(
      record.windowStart.getTime() +
        this.WINDOW_MINUTES * 60 * 1000 +
        this.WINDOW_MINUTES,
    )

    // refresh record
    if (nowTime >= windowEnd) { 
      record.requestCount = 1
      record.windowStart = nowTime
      record.isBlocked = false
      record.blockUntil = null
    } else {
      if (record.requestCount > this.MAX_REQUESTS) {
        record.isBlocked = true
        record.blockUntil = new Date(
          nowTime.getTime() +
            this.BLOCK_MINUTES * 60 * 1000 +
            this.TEHRAN_TIMEZONE,
        )
      } else {
        record.requestCount += 1
      }
    }
    await this.ipRepository.save(record)
  }
}
