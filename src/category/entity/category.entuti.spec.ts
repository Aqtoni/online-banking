import { Category } from './category.entity';
import { validate } from 'class-validator';

describe('Category', () => {
  let category: Category;

  beforeAll(() => {
    category = new Category();
    category.name = 'Car';
  });

  describe('name', () => {
    it('should pass if name string, characters length >= 3', async () => {
      const errors = await validate(category);
      expect(errors).toHaveLength(0);
    });

    it('should fail if name is not a string', async () => {
      category.name = 123 as any;
      const errors = await validate(category);
      expect(errors).toHaveLength(1);
    });

    it('should fail if name length < 3', async () => {
      category.name = 'AB';
      const errors = await validate(category);
      expect(errors).toHaveLength(1);
    });

    it('should fail if name is not a string', async () => {
      category.name = ' ';
      const errors = await validate(category);
      expect(errors).toHaveLength(1);
    });
  });
});
