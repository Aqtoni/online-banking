import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { Banks } from 'src/banks/entity/banks.entity';
import { Category } from 'src/category/entity/category.entity';
import { StatisticsRequestDto } from './dto/get-statistics.dto';
import axios from 'axios';
import { classToPlain } from 'class-transformer';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { NotFindException } from 'src/filters/not-found';

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
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    const bank = await this.banksRepository.findOne({
      where: { id: bankId },
    });

    if (!category || !bank) {
      throw new NotFindException('Category or Bank not found');
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

    const webhookUrl =
      'https://webhook.site/e8f3a95b-9af0-44a8-8c65-f27219a4aaf1';
    const plainTransaction = classToPlain(transaction);

    try {
      await axios.post(webhookUrl, plainTransaction);
    } catch (error) {
      console.error('Failed to send webhook', error);
    }

    return await this.transactionRepository.save(transaction);
  }

  async findAll(page = 1, limit = 10): Promise<Transaction[]> {
    const skip = (page - 1) * limit;
    return this.transactionRepository.find({
      take: limit,
      skip,
    });
  }

  async getStatistics(
    dto: StatisticsRequestDto,
  ): Promise<{ [categoryName: string]: number }> {
    const { categoryIds, fromPeriod, toPeriod } = dto;

    const categories = await this.categoriesRepository.find({
      where: { id: In(categoryIds) },
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFindException('Category not found');
    }

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
    /* 
      SELECT transaction.amount, category.name
      FROM transaction
      LEFT JOIN category ON category.id = category.id
      WHERE category.id IN (1,2,3)
      AND transaction.date BETWEEN '2023-03-01T00:00:00Z' AND '2023-03-02T23:59:59Z';
      */
    const result = {};

    transactions.forEach((transaction) => {
      const categoryName = transaction.category.name;
      if (!result[categoryName]) {
        result[categoryName] = 0;
      }
      result[categoryName] += transaction.amount;
    });

    return result;
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
        throw new NotFindException('Category or Bank not found');
      }

      if (transaction.amount < 0) {
        bank.balance -= transaction.amount;
      } else {
        bank.balance += transaction.amount;
      }

      await this.banksRepository.save(bank);
      await this.transactionRepository.remove(transaction);
    } catch (error) {
      throw new NotFindException('Transaction not found');
    }
  }
}
