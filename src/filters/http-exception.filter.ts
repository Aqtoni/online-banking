import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json(this._response(status, request, exception));
  }
  private _response(status: number, request: Request, exception: unknown) {
    const defaultMessage =
      exception instanceof HttpException ? exception.getResponse() : '';
    const message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Oh, something broke 🙁'
        : defaultMessage;
    return {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url,
      method: request?.method,
      params: request?.params,
      query: request?.query,
      exception: {
        name: exception['name'],
        message,
      },
    };
  }
}
