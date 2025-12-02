// // src/common/filters/all-exceptions.filter.ts
//
// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { QueryFailedError, EntityNotFoundError } from 'typeorm';
//
// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//
//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let errorCode = 'INTERNAL_ERROR';
//     let message = 'خطای داخلی سرور';
//     let errors: Record<string, string[]> | null = null;
//
//     // 1. خطاهای Validation (که تو exceptionFactory ساختیم)
//     if (exception instanceof HttpException) {
//       const res = exception.getResponse();
//
//       if (typeof res === 'object' && res !== null) {
//         status = exception.getStatus();
//
//         // اگر errors داشت → خطای ولیدیشن
//         if ('errors' in res && typeof (res as any).errors === 'object') {
//           errorCode = (res as any).errorCode || 'VALIDATION_ERROR';
//           message = (res as any).message || 'داده‌های ورودی معتبر نیستند';
//           errors = (res as any).errors as Record<string, string[]>;
//         }
//         // اگر فقط message داشت
//         else if ('message' in res) {
//           message = (res as any).message as string;
//           errorCode = (res as any).errorCode || 'BAD_REQUEST';
//         }
//       } else if (typeof res === 'string') {
//         status = exception.getStatus();
//         message = res;
//         errorCode = 'BAD_REQUEST';
//       }
//     }
//
//     // 2. خطای دیتابیس — موبایل تکراری
//     else if (
//       exception instanceof QueryFailedError &&
//       exception.driverError &&
//       typeof (exception.driverError as any)?.code === 'string' &&
//       ['23505', 'ER_DUP_ENTRY'].includes((exception.driverError as any).code)
//     ) {
//       status = HttpStatus.BAD_REQUEST;
//       errorCode = 'DUPLICATE_MOBILE';
//       message = 'کاربری با این شماره موبایل در سیستم موجود است!';
//     }
//
//     // 3. Not Found
//     else if (exception instanceof EntityNotFoundError) {
//       status = HttpStatus.NOT_FOUND;
//       errorCode = 'NOT_FOUND';
//       message = 'منبع مورد نظر یافت نشد';
//     }
//
//     // 4. خطای غیرمنتظره
//     else if (exception instanceof Error) {
//       message = exception.message;
//       this.logger.error(exception.message, exception.stack);
//     }
//
//     this.logger.warn(
//       `[${request.method}] ${request.url} → ${status} ${errorCode}`,
//     );
//
//     response.status(status).json({
//       success: false,
//       statusCode: status,
//       errorCode,
//       message,
//       ...(errors ? { errors } : {}),
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }

// src/common/filters/all-exceptions.filter.ts

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { QueryFailedError, EntityNotFoundError } from 'typeorm';
//
// // نوع دقیق برای خروجی exceptionFactory در ValidationPipe
// interface ValidationExceptionResponse {
//   errorCode?: string;
//   message?: string;
//   errors?: Record<string, string[]>;
// }
//
// // نوع برای driverError در QueryFailedError
// interface DriverError {
//   code?: string;
// }
//
// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//
//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//
//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let errorCode = 'INTERNAL_ERROR';
//     let message: string = 'خطای داخلی سرور';
//     let errors: Record<string, string[]> | null = null;
//
//     // 1. خطاهای HttpException (Validation + BadRequest دستی)
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse();
//
//       if (typeof res === 'string') {
//         message = res;
//         errorCode = 'BAD_REQUEST';
//       } else if (res && typeof res === 'object') {
//         const payload = res as ValidationExceptionResponse;
//
//         // اگر errors داشته باشه → خطای ولیدیشن
//         if (payload.errors && typeof payload.errors === 'object') {
//           errors = payload.errors;
//           errorCode = payload.errorCode ?? 'VALIDATION_ERROR';
//           message = payload.message ?? 'داده‌های ورودی معتبر نیستند';
//         }
//         // در غیر این صورت فقط message داره
//         else if (payload.message) {
//           message = payload.message;
//           errorCode = payload.errorCode ?? 'BAD_REQUEST';
//         }
//       }
//     }
//
//     // 2. خطای دیتابیس — موبایل تکراری
//     else if (
//       exception instanceof QueryFailedError &&
//       typeof (exception as any).driverError === 'object'
//     ) {
//       const driverError = (exception as any).driverError as DriverError;
//       const code = driverError.code;
//
//       if (code === '23505' || code === 'ER_DUP_ENTRY') {
//         status = HttpStatus.BAD_REQUEST;
//         errorCode = 'DUPLICATE_MOBILE';
//         message = 'کاربری با این شماره موبایل در سیستم موجود است!';
//       }
//     }
//
//     // 3. Not Found
//     else if (exception instanceof EntityNotFoundError) {
//       status = HttpStatus.NOT_FOUND;
//       errorCode = 'NOT_FOUND';
//       message = 'منبع مورد نظر یافت نشد';
//     }
//
//     // 4. خطاهای غیرمنتظره
//     else if (exception instanceof Error) {
//       message = exception.message || message;
//       this.logger.error(exception.message, exception.stack);
//     }
//
//     this.logger.warn(
//       `[${request.method}] ${request.url} → ${status} ${errorCode}`,
//     );
//
//     response.status(status).json({
//       success: false,
//       statusCode: status,
//       errorCode,
//       message,
//       ...(errors ? { errors } : {}),
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }

// src/common/filters/all-exceptions.filter.ts

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
//   HttpStatus,
//   Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';
// import { QueryFailedError, EntityNotFoundError } from 'typeorm';
//
// // نوع دقیق برای خروجی exceptionFactory
// interface ValidationExceptionPayload {
//   errorCode?: string;
//   message?: string;
//   errors?: Record<string, string[]>;
// }
//
// // Type Guard برای QueryFailedError + driverError.code
// const hasUniqueConstraintViolation = (
//   ex: unknown,
// ): ex is QueryFailedError & { driverError: { code: string } } => {
//   return (
//     ex instanceof QueryFailedError &&
//     !!ex.driverError &&
//     typeof ex.driverError === 'object' &&
//     'code' in ex.driverError &&
//     (ex.driverError.code === '23505' || ex.driverError.code === 'ER_DUP_ENTRY')
//   );
// };
//
// @Catch()
// export class AllExceptionsFilter implements ExceptionFilter {
//   private readonly logger = new Logger(AllExceptionsFilter.name);
//
//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//
//     let status = HttpStatus.INTERNAL_SERVER_ERROR;
//     let errorCode = 'INTERNAL_ERROR';
//     let message: string = 'خطای داخلی سرور';
//     let errors: Record<string, string[]> | null = null;
//
//     // 1. خطاهای HttpException (ولیدیشن + BadRequest دستی)
//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse();
//
//       if (typeof res === 'string') {
//         message = res;
//         errorCode = 'BAD_REQUEST';
//       } else if (res && typeof res === 'object') {
//         const payload = res as ValidationExceptionPayload;
//
//         if (payload.errors) {
//           errors = payload.errors;
//           errorCode = payload.errorCode ?? 'VALIDATION_ERROR';
//           message = payload.message ?? 'داده‌های ورودی معتبر نیستند';
//         } else if (payload.message) {
//           message = payload.message;
//           errorCode = payload.errorCode ?? 'BAD_REQUEST';
//         }
//       }
//     }
//
//     // 2. خطای دیتابیس — موبایل تکراری (بدون any!)
//     else if (hasUniqueConstraintViolation(exception)) {
//       status = HttpStatus.BAD_REQUEST;
//       errorCode = 'DUPLICATE_MOBILE';
//       message = 'کاربری با این شماره موبایل در سیستم موجود است!';
//     }
//
//     // 3. Not Found
//     else if (exception instanceof EntityNotFoundError) {
//       status = HttpStatus.NOT_FOUND;
//       errorCode = 'NOT_FOUND';
//       message = 'منبع مورد نظر یافت نشد';
//     }
//
//     // 4. خطاهای غیرمنتظره
//     else if (exception instanceof Error) {
//       message = exception.message || message;
//       this.logger.error(exception.message, exception.stack);
//     }
//
//     // لاگ
//     this.logger.warn(
//       `[${request.method}] ${request.url} → ${status} ${errorCode}`,
//     );
//
//     // پاسخ نهایی — همیشه یک ساختار
//     response.status(status).json({
//       success: false,
//       statusCode: status,
//       errorCode,
//       message,
//       ...(errors ? { errors } : {}),
//       timestamp: new Date().toISOString(),
//       path: request.url,
//     });
//   }
// }

// src/common/filters/all-exceptions.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

// نوع دقیق برای exceptionFactory
interface ValidationExceptionPayload {
  errorCode?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

// Type Guard کاملاً ایمن برای unique violation
const isUniqueConstraintError = (ex: unknown): boolean => {
  if (!(ex instanceof QueryFailedError)) return false;
  if (!ex.driverError) return false;
  if (typeof ex.driverError !== 'object') return false;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const driverError = ex.driverError as any; // فقط اینجا یه بار، چون TypeORM خودش any گذاشته
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof driverError.code === 'string' &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (driverError.code === '23505' || driverError.code === 'ER_DUP_ENTRY')
  );
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_ERROR';
    let message: string = 'خطای داخلی سرور';
    let errors: Record<string, string[]> | null = null;

    // 1. خطاهای Validation + BadRequest دستی
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
        errorCode = 'BAD_REQUEST';
      } else if (res && typeof res === 'object') {
        const payload = res as ValidationExceptionPayload;

        if (payload.errors) {
          errors = payload.errors;
          errorCode = payload.errorCode ?? 'VALIDATION_ERROR';
          message = payload.message ?? 'داده‌های ورودی معتبر نیستند';
        } else if (payload.message) {
          message = payload.message;
          errorCode = payload.errorCode ?? 'BAD_REQUEST';
        }
      }
    }

    // 2. موبایل تکراری در دیتابیس — بدون خطای ESLint!
    else if (isUniqueConstraintError(exception)) {
      status = HttpStatus.BAD_REQUEST;
      errorCode = 'DUPLICATE_MOBILE';
      message = 'کاربری با این شماره موبایل در سیستم موجود است!';
    }

    // 3. Not Found
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      errorCode = 'NOT_FOUND';
      message = 'منبع مورد نظر یافت نشد';
    }

    // 4. خطاهای غیرمنتظره
    else if (exception instanceof Error) {
      message = exception.message || message;
      this.logger.error(exception.message, exception.stack);
    }

    // لاگ
    this.logger.warn(
      `[${request.method}] ${request.url} → ${status} ${errorCode}`,
    );

    // پاسخ نهایی
    response.status(status).json({
      success: false,
      statusCode: status,
      errorCode,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
