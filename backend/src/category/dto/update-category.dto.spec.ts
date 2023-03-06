import { validate } from 'class-validator';
import { UpdateCategoryDto } from './update-category.dto ';

describe('updateCategoryDto', () => {
  let dto: UpdateCategoryDto;

  beforeAll(() => {
    dto = new UpdateCategoryDto();
    dto.name = 'Car';
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

    it('should fail if name length < 3', async () => {
      dto.name = 'AB';
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });

    it('should fail if name is not a string', async () => {
      dto.name = ' ';
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
    });
  });
});
