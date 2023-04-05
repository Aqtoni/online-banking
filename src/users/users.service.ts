import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto ';
// import { CreateUser } from './dto/create-user.dto ';
// import { AlreadyExistsException } from 'src/filters/already-exists';
import { NotFindException } from 'src/filters/not-found';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // async createUser(dto: CreateUser): Promise<Users> {
  //   try {
  //     return await this.usersRepository.save(dto);
  //   } catch (error) {
  //     if (error.code === '23505') {
  //       throw new AlreadyExistsException('Email with this name already exists');
  //     }
  //     throw error;
  //   }
  // }

  async getAllUsers(): Promise<Users[]> {
    const users = await this.usersRepository.find();
    if (!users || users.length == 0) {
      throw new NotFindException('Users not found');
    }
    return users;
  }

  async getUserById(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFindException('User not found');
    }
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFindException('User not found');
    }
    if (dto.email) {
      dto.email = dto.email.toLowerCase();
    }
    const updatedUser = Object.assign(user, dto);
    return this.usersRepository.save(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFindException('User not found');
    }
    await this.usersRepository.delete(id);
  }
}
