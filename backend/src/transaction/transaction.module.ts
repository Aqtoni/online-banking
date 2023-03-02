import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entuty';
import { TransactionService } from './transaction.service';
import { Banks } from 'src/banks/entity/banks.entuty';
import { Category } from 'src/category/entity/category.entuty';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Banks, Category])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
