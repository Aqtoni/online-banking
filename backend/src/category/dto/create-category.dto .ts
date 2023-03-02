import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Car', description: 'The category name' })
  @IsNotEmpty()
  name: string;
}
