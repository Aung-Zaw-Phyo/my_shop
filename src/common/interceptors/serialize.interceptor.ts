import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



interface ClassConstructor {
  new (...args: any[]): {}
}

interface ResponseFormat<T> {
  success: boolean;
  message: string;
  error: string | null;
  statusCode: number;
  data: any;
}

export function Serialize(dto: ClassConstructor, message: string = 'Request successful') {
  return UseInterceptors(new SerializeInterceptor(dto, message))
}

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: any, private message: string){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any): ResponseFormat<T> => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        const newFormat = plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
        return {
          success: statusCode >= 200 && statusCode < 300,
          message: this.message,
          error: null,
          statusCode,
          data: newFormat,
        };
        
      }),
    );
  }
}
