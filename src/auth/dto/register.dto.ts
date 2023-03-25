import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'anton@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Anton',
    description: 'The first name of the user',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @ApiProperty({
    example: 'Kovtun',
    description: 'The last name of the user',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @ApiProperty({
    example: 'super-secret-password 😏',
    description: 'The password of the user',
    minLength: 10,
  })
  @MinLength(10)
  password: string;

  @ApiProperty({
    example: '+123123123123',
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;
}
