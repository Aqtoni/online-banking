import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AlreadyExistsException } from 'src/filters/already-exists';
import { Users } from 'src/users/entity/users.entity';
import { ForbiddenException } from '@nestjs/common';
import { CreateUser } from 'src/users/dto/create-user.dto ';
import { AuthDto } from './dto/auth.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as argon from 'argon2';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  signAsync: jest.fn(),
});

const mockConfigService = () => ({
  get: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<Users>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useFactory: mockJwtService },
        { provide: ConfigService, useFactory: mockConfigService },
        { provide: getRepositoryToken(Users), useFactory: mockUserRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('signup', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password1234',
        balance: 1000,
      };
      const mockHash = 'mock-hash';
      const mockUser = { ...createUserDto, hash: mockHash };
      const mockAccessToken = 'mock-access-token';
      jest.spyOn(argon, 'hash').mockResolvedValue(mockHash);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'signToken')
        .mockResolvedValue({ access_token: mockAccessToken });

      const result = await authService.signup(createUserDto);

      expect(result).toEqual({ access_token: mockAccessToken });
      expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
      expect(authService.signToken).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
      );
    });

    it('should throw AlreadyExistsException if the user already exists', async () => {
      const createUserDto: CreateUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password1234',
        balance: 1000,
      };
      jest.spyOn(usersRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(authService.signup(createUserDto)).rejects.toThrow(
        AlreadyExistsException,
      );
    });

    it('should re-throw any other error', async () => {
      const createUserDto: CreateUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password1234',
        balance: 1000,
      };
      jest.spyOn(usersRepository, 'save').mockRejectedValue(new Error());

      await expect(authService.signup(createUserDto)).rejects.toThrow(Error);
    });
  });
});
