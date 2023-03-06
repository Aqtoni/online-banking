import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { TransactionService } from './transaction.service';
import { Banks } from 'src/banks/entity/banks.entity';
import { Category } from 'src/category/entity/category.entity';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Banks, Category])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
