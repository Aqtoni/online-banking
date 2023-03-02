import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsIn } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the transaction',
  })
  @IsNumber()
  categoryId: number;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the bank',
  })
  @IsNumber()
  bankId: number;

  @ApiProperty({
    example: 100,
    description: 'The amount of the transaction',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'profitable',
    description: 'The type of the transaction',
    enum: ['profitable', 'consumable'],
    default: 'consumable',
  })
  @IsString()
  @IsIn(['consumable', 'profitable'])
  type: string;
}
