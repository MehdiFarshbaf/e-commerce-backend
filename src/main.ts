import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // فقط فیلدهایی که در DTO تعریف کردی رو قبول می‌کنه
      forbidNonWhitelisted: false, // اگر فیلد اضافی بفرستن → خطا می‌ده
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const result = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints ?? {});
          return acc;
        }, {});

        return new BadRequestException({
          message: 'Validation failed',
          errors: result, // اینجا خطاها جدا بر اساس فیلد می‌شن
          statusCode: 400,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
