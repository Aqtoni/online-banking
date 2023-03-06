import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFindException extends HttpException {
  constructor(msg?: string, statusCode?: HttpStatus) {
    super(msg || 'Not found', statusCode || HttpStatus.NOT_FOUND);
  }
}
