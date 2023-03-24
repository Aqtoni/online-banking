import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Banks {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the bank',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2023-02-01T00:00:00',
    description: 'The date and time the bank was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2023-03-01T00:00:00',
    description: 'The date and time the bank was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'Bank', description: 'The bank name', minLength: 3 })
  @Column({ unique: true })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: '1000',
    description: 'The current balance of the bank',
  })
  @Column({ default: 0 })
  @IsNumber()
  balance: number;
}
