import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
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
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time the bank was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-02-01T00:00:00.000Z',
    description: 'The date and time the bank was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'Bank', description: 'The bank name' })
  @Column({ unique: true })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1000',
    description: 'The current balance of the bank',
  })
  @Column({ default: 0 })
  balance: number;
}
