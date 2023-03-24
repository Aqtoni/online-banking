import { validate } from 'class-validator';
import { StatisticsRequestDto } from './get-statistics.dto';

describe('StatisticsRequestDto', () => {
  let dto: StatisticsRequestDto;

  beforeEach(() => {
    dto = new StatisticsRequestDto();
    dto.categoryIds = [1, 2, 3];
    dto.fromPeriod = '2022-01-01T00:00:00.000Z';
    dto.toPeriod = '2022-01-31T23:59:59.999Z';
  });

  describe('categoryIds', () => {
    it('should pass if categoryIds is not empty', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if categoryIds is empty', async () => {
      dto.categoryIds = [];
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('fromPeriod', () => {
    it('should pass if fromPeriod is a valid date string', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if fromPeriod is not a valid date string', async () => {
      dto.fromPeriod = 'not a date';
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('toPeriod', () => {
    it('should pass if toPeriod is a valid date string', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if toPeriod is not a valid date string', async () => {
      dto.toPeriod = 'not a date';
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });
});
