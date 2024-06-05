import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface ResponseFormat<T> {
  success: boolean;
  message: string;
  error: string | null;
  statusCode: number;
  data: T | null;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    response.status(status).json({
      success: false,
      message: exceptionResponse.message || 'An error occurred',
      error: exceptionResponse.error || null,
      statusCode: status,
      data: null,
    });
  }
}
