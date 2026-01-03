import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Cleanup } from './jobs/cleanup.job';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpRecord } from 'src/ip-tracker/entities/ip-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpRecord])],
  providers: [TasksService, Cleanup]
})
export class TasksModule { }
