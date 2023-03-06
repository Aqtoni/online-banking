import { CreateTransactionDto } from './create-transaction.dto';
import { validate } from 'class-validator';

describe('CreateTransactionDto', () => {
  let dto: CreateTransactionDto;

  beforeEach(() => {
    dto = new CreateTransactionDto();
    dto.categoryId = 1;
    dto.bankId = 1;
    dto.amount = 100;
    dto.type = 'consumable';
  });

  describe('categoryId', () => {
    it('should pass if categoryId is a number', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if categoryId is not a number', async () => {
      dto.categoryId = '1' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('bankId', () => {
    it('should pass if bankId is a number', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if bankId is not a number', async () => {
      dto.bankId = '1' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('amount', () => {
    it('should pass if amount is a number', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if amount is not a number', async () => {
      dto.amount = '100' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });

  describe('type', () => {
    it('should pass if type is a valid enum value', async () => {
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail if type is not a valid enum value', async () => {
      dto.type = '' as any;
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });
});
