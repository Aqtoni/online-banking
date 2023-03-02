import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entity/transaction.entuty';
import { StatisticsRequestDto } from './dto/get-statistics.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new transaction',
    type: Transaction,
  })
  @ApiNotFoundResponse({ description: 'Category or Bank not found' })
  @ApiUnprocessableEntityResponse({ description: 'Insufficient balance' })
  @ApiBadRequestResponse({ description: 'Invalid transaction type' })
  async createTransaction(
    @Body() dto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(dto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all transaction',
    type: [Transaction],
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve transaction',
  })
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<Transaction[]> {
    return this.transactionService.findAll(page, limit);
  }

  @Get('/statistics')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get statistics of transaction',
    type: [Transaction],
  })
  @ApiBadRequestResponse({ description: 'Error getting statistics' })
  async getStatistics(@Query() dto: StatisticsRequestDto) {
    return await this.transactionService.getStatistics(dto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Transaction deleted',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async deleteTransaction(@Param('id') transactionId: number): Promise<void> {
    await this.transactionService.deleteTransaction(transactionId);
  }
}
