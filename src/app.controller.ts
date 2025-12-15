import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController, ApiExcludeEndpoint } from '@nestjs/swagger';

// @ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
