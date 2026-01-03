import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface ResponseAPI<T> {
    success: boolean,
    message: string,
    data: T
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseAPI<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseAPI<T>> {
        return next.handle().pipe(
            map((data) => {
                const response = context.switchToHttp().getResponse()
                if (data && typeof data === 'object' && 'success' in data) {
                    return data as ResponseAPI<T>
                }

                return {
                    success: true,
                    message: data?.message || 'عملیات موفقیت آمیز بود',
                    data: data?.data !== undefined ? data.data : data,
                    statusCode: response.statusCode
                }
            })
        )
    }
}