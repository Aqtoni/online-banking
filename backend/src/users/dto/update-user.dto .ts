import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Min,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Anton', description: 'The first name of the user' })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Kovtun', description: 'The last name of the user' })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'anton@example.com',
    description: 'The email of the user',
  })
  @IsOptional()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'super-secret-password 😏',
    description: 'The password of the user',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    example: 1000,
    description: 'The current balance of the user',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance: number;
}
