import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class updateCategoryDto {
  @ApiProperty({ example: 'Car', description: 'The category name' })
  @IsOptional()
  name: string;
}
