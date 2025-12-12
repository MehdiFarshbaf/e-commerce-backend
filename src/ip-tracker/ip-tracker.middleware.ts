import { Injectable, NestMiddleware } from '@nestjs/common';
import { IpTrackerService } from './ip-tracker.service';
import { NextFunction, Request } from 'express';

@Injectable()
export class IpTrackerMiddleware implements NestMiddleware {
  constructor(private readonly ipTrackerService: IpTrackerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.ip) {
      await this.ipTrackerService.track(req.ip);
    }
    next();
  }
}

