import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { BanksService } from './banks.service';
import { Banks } from './entity/banks.entity';
import { UpdateBankDto } from './dto/update-bank.dto ';
import { CreateBankDto } from './dto/create-bank.dto';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('banks')
@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all banks',
    type: [Banks],
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve banks',
  })
  async getAllBanks(): Promise<Banks[]> {
    return this.banksService.getAllBanks();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get bank by id',
    type: Banks,
  })
  @ApiNotFoundResponse({ description: 'Bank not found' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to retrieve bank',
  })
  async getBankById(@Param('id') id: number): Promise<Banks> {
    return this.banksService.getBankById(id);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new bank',
    type: Banks,
  })
  @ApiConflictResponse({ description: 'Bank name already exists' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create bank' })
  async createBank(@Body() dto: CreateBankDto): Promise<Banks> {
    return this.banksService.createBank(dto);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update bank by id',
    type: Banks,
  })
  @ApiNotFoundResponse({ description: 'Bank not found' })
  @ApiInternalServerErrorResponse({ description: 'Failed to update bank' })
  async updateBank(
    @Param('id') id: number,
    @Body() dto: UpdateBankDto,
  ): Promise<Banks> {
    return this.banksService.updateBank(id, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Bank deleted' })
  @ApiNotFoundResponse({ description: 'Bank not found' })
  @ApiBadRequestResponse({
    description: 'Cannot delete bank with associated transactions',
  })
  @ApiInternalServerErrorResponse({ description: 'Failed to delete bank' })
  async deleteBank(@Param('id') id: number): Promise<void> {
    await this.banksService.deleteBank(id);
  }
}
