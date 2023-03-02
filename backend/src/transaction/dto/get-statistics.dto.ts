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
    example: '2022-01-01T00:00:00.000Z',
    description: 'The start date of the period to filter',
  })
  @IsNotEmpty()
  @IsDateString()
  fromPeriod: string;

  @ApiProperty({
    example: '2022-01-31T23:59:59.999Z',
    description: 'The end date of the period to filter',
  })
  @IsNotEmpty()
  @IsDateString()
  toPeriod: string;
}
