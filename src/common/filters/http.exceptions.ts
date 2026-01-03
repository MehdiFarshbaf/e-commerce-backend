import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptions implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp()

        const response = context.getResponse()
        const request = context.getRequest()

        const status = exception.getStatus()
        const exceptionResponse: any = exception.getResponse()
        const message = exceptionResponse.message || exceptionResponse

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            path: request.path
        })
    }
}