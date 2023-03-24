import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotDeleteException extends HttpException {
  constructor(msg?: string, statusCode?: HttpStatus) {
    super(
      msg || 'Cannot delete with associated transactions',
      statusCode || HttpStatus.BAD_REQUEST,
    );
  }
}
