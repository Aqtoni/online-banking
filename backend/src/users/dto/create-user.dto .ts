import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUser {
  @ApiProperty({ example: 'Anton', description: 'The first name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Kovtun', description: 'The last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'anton@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'super-secret-password 😏',
    description: 'The password of the user',
    minLength: 10,
  })
  @MinLength(10)
  password: string;

  @ApiProperty({
    example: 1000,
    description: 'The current balance of the user',
  })
  @IsNumber()
  @IsOptional()
  balance: number;
}
