import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Banks } from './entity/banks.entity';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto ';
import { AlreadyExistsException } from 'src/filters/already-exists';
import { CannotDeleteException } from 'src/filters/cannot-delete';
import { NotFindException } from 'src/filters/not-found';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(Banks)
    private banksRepository: Repository<Banks>,
  ) {}

  async createBank(dto: CreateBankDto): Promise<Banks> {
    try {
      return await this.banksRepository.save(dto);
    } catch (error) {
      if (error.code === '23505') {
        throw new AlreadyExistsException('Bank with this name already exists');
      }
      throw error;
    }
  }

  async getAllBanks(): Promise<Banks[]> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const banks = await this.banksRepository.find();
          if (!banks || banks.length == 0) {
            throw new NotFindException('Banks not found');
          }
          resolve(banks);
        } catch (error) {
          reject(error);
        }
      }, 3000);
    });
  }
  // async getAllBanks(): Promise<Banks[]> {
  //   return await this.banksRepository.find();
  // }

  async getBankById(id: number): Promise<Banks> {
    const bank = await this.banksRepository.findOne({ where: { id } });
    if (!bank) {
      throw new NotFindException('Bank not found');
    }
    return bank;
  }

  async updateBank(id: number, dto: UpdateBankDto): Promise<Banks> {
    try {
      const bank = await this.banksRepository.findOne({ where: { id } });
      if (!bank) {
        throw new NotFindException('Bank not found');
      }

      const updatedBank = Object.assign(bank, dto);
      return await this.banksRepository.save(updatedBank);
    } catch (error) {
      if (error.code === '23505') {
        throw new AlreadyExistsException('Bank with this name already exists');
      }
      throw error;
    }
  }

  async deleteBank(id: number): Promise<void> {
    try {
      const bank = await this.banksRepository.findOne({ where: { id } });
      if (!bank) {
        throw new NotFindException('Bank not found');
      }

      await this.banksRepository.remove(bank);
    } catch (error) {
      if (error.code === '23503') {
        throw new CannotDeleteException();
      }
      throw error;
    }
  }
}
