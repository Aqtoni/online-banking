import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Car',
    description: 'The category name',
    minLength: 3,
  })
  @IsOptional()
  @MinLength(3)
  name: string;
}
