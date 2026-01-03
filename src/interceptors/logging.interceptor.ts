import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): any {
        const now = Date.now()
        console.log(`Before : ${new Date()}`)

        return next.handle().pipe(
            tap(() => {
                console.log(`Time process : ${Date.now() - now}ms`)
            })
        )

    }
}