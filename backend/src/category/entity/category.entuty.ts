import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the category',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'The date and time the category was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-02-01T00:00:00.000Z',
    description: 'The date and time the category was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ example: 'Car', description: 'The category name' })
  @Column({ unique: true })
  @IsString()
  name: string;
}
