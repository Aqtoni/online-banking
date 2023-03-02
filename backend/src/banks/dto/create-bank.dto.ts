import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty({ example: 'Bank', description: 'The bank name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1000',
    description: 'The current balance of the bank',
  })
  @IsOptional()
  @IsNumber()
  balance: number;
}
