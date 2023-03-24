import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistsException extends HttpException {
  constructor(msg?: string, statusCode?: HttpStatus) {
    super(msg || 'Already exists', statusCode || HttpStatus.CONFLICT);
  }
}
