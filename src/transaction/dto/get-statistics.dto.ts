import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty } from 'class-validator';

export class StatisticsRequestDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'An array of category id to filter',
  })
  @IsNotEmpty()
  @IsArray()
  categoryIds: number[];

  @ApiProperty({
    example: '2023-03-01T00:00:00',
    description: 'The start date of the period to filter',
  })
  @IsNotEmpty()
  @IsDateString()
  fromPeriod: string;

  @ApiProperty({
    example: '2023-03-31T23:59:59',
    description: 'The end date of the period to filter',
  })
  @IsNotEmpty()
  @IsDateString()
  toPeriod: string;
}
