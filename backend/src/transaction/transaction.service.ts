import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entuty';
import { Banks } from 'src/banks/entity/banks.entuty';
import { Category } from 'src/category/entity/category.entuty';
import { StatisticsRequestDto } from './dto/get-statistics.dto';
import axios from 'axios';
import { classToPlain } from 'class-transformer';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Banks)
    private banksRepository: Repository<Banks>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const { categoryId, bankId, amount, type } = dto;
    const category = await this.categoriesRepository.findOneOrFail({
      where: { id: categoryId },
    });
    const bank = await this.banksRepository.findOneOrFail({
      where: { id: bankId },
    });

    if (!category.id || !bank.id) {
      throw new NotFoundException('Category or Bank not found');
    }

    if (type === 'consumable') {
      if (bank.balance < amount) {
        throw new UnprocessableEntityException('Insufficient balance');
      }
      bank.balance -= amount;
    } else if (type === 'profitable') {
      bank.balance += amount;
    } else {
      throw new BadRequestException('Invalid transaction type');
    }

    const transaction = this.transactionRepository.create({
      category,
      bank,
      amount,
    });

    await this.banksRepository.save(bank);

    const webhookUrl = 'http://127.0.0.1:5405/webhook/transactions';
    const plainTransaction = classToPlain(transaction);

    try {
      await axios.post(webhookUrl, plainTransaction);
    } catch (error) {
      console.error('Failed to send webhook', error);
    }

    return await this.transactionRepository.save(transaction);
  }

  async findAll(page = 1, limit = 10): Promise<Transaction[]> {
    try {
      const skip = (page - 1) * limit;
      return this.transactionRepository.find({
        take: limit,
        skip,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStatistics(
    dto: StatisticsRequestDto,
  ): Promise<{ [categoryName: string]: number }> {
    try {
      const { categoryIds, fromPeriod, toPeriod } = dto;

      const transactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .select(['transaction.amount', 'category.name'])
        .leftJoin('transaction.category', 'category')
        .where('category.id IN (:...categoryIds)', { categoryIds })
        .andWhere('transaction.date BETWEEN :from AND :to', {
          from: new Date(fromPeriod),
          to: new Date(toPeriod),
        })
        .getMany();

      const result = {};

      transactions.forEach((transaction) => {
        const categoryName = transaction.category.name;
        if (!result[categoryName]) {
          result[categoryName] = 0;
        }
        result[categoryName] += transaction.amount;
      });

      return result;
    } catch (error) {
      throw new BadRequestException('Error getting statistics');
    }
  }

  async deleteTransaction(transactionId: number): Promise<void> {
    try {
      const transaction = await this.transactionRepository.findOneOrFail({
        where: { id: transactionId },
        relations: ['category', 'bank'],
      });

      const category = transaction.category;
      const bank = transaction.bank;

      if (!category.id || !bank.id) {
        throw new NotFoundException('Category or Bank not found');
      }

      if (transaction.amount < 0) {
        bank.balance -= transaction.amount;
      } else {
        bank.balance += transaction.amount;
      }

      await this.banksRepository.save(bank);
      await this.transactionRepository.remove(transaction);
    } catch (error) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
