// import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

// import { LoggerMiddleware } from 'src/middlewares/logger/logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {
  // export class UsersModule implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
  //   // consumer.apply(LoggerMiddleware).forRoutes(UsersController) // روی تمام این کنترلر اعمال میشه
  //   consumer.apply(LoggerMiddleware).forRoutes({ path: 'users', method: RequestMethod.POST }, { path: 'user/:id', method: RequestMethod.GET })
  // }
}
