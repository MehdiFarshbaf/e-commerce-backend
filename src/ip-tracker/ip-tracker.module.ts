import { Module } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';

@Module({
  providers: [IpTrackerService]
})
export class IpTrackerModule {}
