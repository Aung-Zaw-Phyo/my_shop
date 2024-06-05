import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseFormat<T> {
  success: boolean;
  message: string;
  error: string | null;
  statusCode: number;
  data: T | null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        return {
          success: statusCode >= 200 && statusCode < 300,
          message: data?.message || 'Request successful',
          error: data.error ? data.error : null,
          statusCode,
          data: data.data || null,
        };
      }),
    );
  }
}
