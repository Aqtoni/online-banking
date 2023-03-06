import { ApiProperty } from '@nestjs/swagger';
import { Banks } from 'src/banks/entity/banks.entity';
import { Category } from 'src/category/entity/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
export class Transaction {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the transaction',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time the transaction was created',
  })
  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;

  @ApiProperty({
    example: 100,
    description: 'The amount of the transaction',
  })
  @Column()
  amount: number;

  @ApiProperty({
    example: 'profitable',
    description: 'The type of the transaction',
    enum: ['profitable', 'consumable'],
    default: 'consumable',
  })
  @Column({
    type: 'enum',
    enum: ['profitable', 'consumable'],
    default: 'consumable',
  })
  type: string;

  @ManyToOne(() => Banks)
  @JoinColumn()
  bank: Banks;
}
