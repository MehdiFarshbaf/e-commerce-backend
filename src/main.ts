import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { LoggerMiddleware } from './middlewares/logger/logger.middleware'
import { setupSwagger } from './config/swagger.config'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter())

  app.useGlobalGuards(new JwtAuthGuard())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transforms payload to DTO instance
      whitelist: true, // Strips properties that are NOT defined in the DTO
      // forbidNonWhitelisted: true,      // ← Remove or set to false (this is the key!)
      forbidNonWhitelisted: false, // Allows extra fields without throwing error

      exceptionFactory: errors => {
        // This factory only runs when there are real validation errors
        // (e.g. @IsEmail(), @IsString(), etc.)
        // Since forbidNonWhitelisted is false, "property should not exist" errors won't appear here
        const result = errors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints || {})
          return acc
        }, {} as Record<string, string[]>)

        return new BadRequestException({
          errorCode: 'VALIDATION_ERROR',
          message: 'داده‌های ورودی معتبر نیستند',
          errors: result,
        })
      },
    }),
  )

  app.use(new LoggerMiddleware().use)

  // Swagger setup
  setupSwagger(app)

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
