import { validate } from 'class-validator';
import { UpdateBankDto } from './update-bank.dto ';

describe('UpdateBankDto', () => {
  let dto: UpdateBankDto;

  beforeEach(() => {
    dto = new UpdateBankDto();
    dto.name = 'Bank';
    dto.balance = 1000;
  });

  describe('name', () => {
    it('should pass if name string, characters length >= 3', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if name is not a string', async () => {
      dto.name = 123 as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });

    it('hould fail if name length < 3', async () => {
      dto.name = 'Ba';
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('balance', () => {
    it('should pass if balance is a number', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass if balance is undefined', async () => {
      dto.balance = undefined;
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if balance is not a number', async () => {
      dto.balance = '1000' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });
});
