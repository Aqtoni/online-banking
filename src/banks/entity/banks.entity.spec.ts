import { validate } from 'class-validator';
import { Banks } from './banks.entity';

describe('CreateBankbank', () => {
  let bank: Banks;

  beforeEach(() => {
    bank = new Banks();
    bank.name = 'Bank';
    bank.balance = 1000;
  });

  describe('name', () => {
    it('should pass if name string, characters length >= 3', async () => {
      const errors = await validate(bank);
      expect(errors).toHaveLength(0);
    });

    it('should fail if name is not a string', async () => {
      bank.name = 123 as any;
      const errors = await validate(bank);
      expect(errors).toHaveLength(1);
    });

    it('hould fail if name length < 3', async () => {
      bank.name = 'Ba';
      const errors = await validate(bank);
      expect(errors).toHaveLength(1);
    });
  });

  describe('balance', () => {
    it('should pass if balance is a number', async () => {
      const errors = await validate(bank);
      expect(errors).toHaveLength(0);
    });

    it('should pass if balance is undefined', async () => {
      bank.balance = undefined;
      const errors = await validate(bank);
      expect(errors).toHaveLength(0);
    });

    it('should fail if balance is not a number', async () => {
      bank.balance = 'not number' as any;
      const errors = await validate(bank);
      expect(errors).toHaveLength(1);
    });
  });
});
