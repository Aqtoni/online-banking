import { Users } from './users.entity';
import { validate } from 'class-validator';

describe('Users Entity', () => {
  let user: Users;

  beforeEach(() => {
    user = new Users();
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.email = 'john.doe@example.com';
    user.hash = 'super-secret-password';
  });

  describe('firstName', () => {
    it('should pass if name string, characters length >= 3', async () => {
      const errors = await validate(user);
      expect(errors).toHaveLength(0);
    });

    it('should not be empty', async () => {
      user.firstName = '';
      const errors = await validate(user);
      await expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('lastName', () => {
    it('should pass if name string, characters length >= 3', async () => {
      const errors = await validate(user);
      expect(errors).toHaveLength(0);
    });

    it('should not be empty', async () => {
      user.lastName = '';
      const errors = await validate(user);
      await expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('email', () => {
    it('should be defined', async () => {
      await expect(user.email).toBeDefined();
    });

    it('should not be empty', async () => {
      user.email = '';
      const errors = await validate(user);
      await expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('hash', () => {
    it('should be defined', async () => {
      await expect(user.hash).toBeDefined();
    });

    it('should have a length >= 10', async () => {
      user.hash = 'pass';
      const errors = await validate(user);
      const error = errors.find((e) => e.property === 'hash');
      await expect(error.constraints.minLength).toBeDefined();
    });

    it('should not be empty', async () => {
      user.hash = '';
      const errors = await validate(user);
      const error = errors.find((e) => e.property === 'hash');
      await expect(error.constraints.isNotEmpty).toBeDefined();
    });
  });
});
