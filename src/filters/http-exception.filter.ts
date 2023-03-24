import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = 500;
    let message = 'Oh, something broke 🙁';
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }
    this.logger.error(`${message} ${exception as Error}`);
    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
