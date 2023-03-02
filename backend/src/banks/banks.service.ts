import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Banks } from './entity/banks.entuty';
import { CreateBankDto } from './dto/create-bank.dto';
import { updateBankDto } from './dto/update-bank.dto ';

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
        throw new HttpException(
          'Bank with this name already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Failed to create bank',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllBanks(): Promise<Banks[]> {
    try {
      return await this.banksRepository.find();
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve banks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBankById(id: number): Promise<Banks> {
    try {
      const bank = await this.banksRepository.findOne({ where: { id } });
      if (!bank) {
        throw new HttpException('Bank not found', HttpStatus.NOT_FOUND);
      }
      return bank;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve bank',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBank(id: number, dto: updateBankDto): Promise<Banks> {
    try {
      const bank = await this.banksRepository.findOne({ where: { id } });
      if (!bank) {
        throw new HttpException('Bank not found', HttpStatus.NOT_FOUND);
      }

      const updatedBank = Object.assign(bank, dto);
      return this.banksRepository.save(updatedBank);
    } catch (error) {
      throw new HttpException(
        'Failed to update bank',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBank(id: number): Promise<void> {
    try {
      const bank = await this.banksRepository.findOne({ where: { id } });
      if (!bank) {
        throw new HttpException('Bank not found', HttpStatus.NOT_FOUND);
      }

      await this.banksRepository.remove(bank);
    } catch (error) {
      if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete bank with associated transactions',
        );
      }
      throw new InternalServerErrorException('Failed to delete bank');
    }
  }
}
