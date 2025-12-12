import { Injectable } from '@nestjs/common';

@Injectable()
export class IpTrackerService {
  private readonly MAX_REQUESTS = 10;
  private readonly WINDOW_MINUTES = 1;
  private readonly BLOCK_MINUTES = 1;

  async track(ip: string) {
    const nowTime = Date.now();
    console.log(`IP: ${ip} send request on time: ${nowTime}`);
  }
}
