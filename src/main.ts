import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Validation
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     exceptionFactory: (errors) =>
  //       new HttpException(
  //         {
  //           success: false,
  //           errorCode: 'VALIDATION_ERROR',
  //           message: 'داده‌های ورودی معتبر نیستند',
  //           details: errors.map((e) => ({
  //             field: e.property,
  //             errors: Object.values(e.constraints || {}),
  //           })),
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       ),
  //   }),
  // );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // فقط فیلدهایی که در DTO تعریف کردی رو قبول می‌کنه
  //     forbidNonWhitelisted: false, // اگر فیلد اضافی بفرستن → خطا می‌ده
  //     transform: true,
  //     exceptionFactory: (errors: ValidationError[]) => {
  //       const result = errors.reduce((acc, error) => {
  //         acc[error.property] = Object.values(error.constraints ?? {});
  //         return acc;
  //       }, {});
  //
  //       return new BadRequestException({
  //         message: 'Validation failed',
  //         errors: result, // اینجا خطاها جدا بر اساس فیلد می‌شن
  //         statusCode: 400,
  //       });
  //     },
  //   }),
  // );

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     disableErrorMessages: false, // این خط مهمه! بدون این، گروه‌بندی نمیشه
  //   }),
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // این خط مهمه! بدون این، خطاها گروه‌بندی نمیشن
      exceptionFactory: (errors) => {
        const result = errors.reduce(
          (acc, error) => {
            acc[error.property] = Object.values(error.constraints || {});
            return acc;
          },
          {} as Record<string, string[]>,
        );

        return new BadRequestException({
          errorCode: 'VALIDATION_ERROR',
          message: 'داده‌های ورودی معتبر نیستند',
          errors: result,
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
