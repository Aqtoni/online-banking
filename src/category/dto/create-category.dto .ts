import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Car',
    description: 'The category name',
    minLength: 3,
  })
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
