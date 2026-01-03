import { Injectable } from '@nestjs/common';
import { Cleanup } from './jobs/cleanup.job';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
    constructor(
        private readonly cleanUp: Cleanup
    ) { }

    // @Cron('* * * * *')
    // @Cron(CronExpression.EVERY_5_SECONDS)
    // @Timeout(5000) //5secound
    // @Interval(3000) //3secound
    // @Cron(CronExpression.EVERY_5_SECONDS)
    cleanOtoData() {
        this.cleanUp.cleanOtp()
    }
}
