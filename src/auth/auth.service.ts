import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsException } from 'src/filters/already-exists';
import { Users } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/logIn.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: RegisterDto, res: Response) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.usersRepository.create({
        ...dto,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
      const payload = { userId: user.id, email: dto.email };
      const token = this.jwt.sign(payload);
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
    } catch (error) {
      if (error.code === '23505') {
        throw new AlreadyExistsException('Email with this name already exists');
      }
      throw error;
    }
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { userId: user.id, email: dto.email };
    const token = this.jwt.sign(payload);
    res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
  }

  logout(res: Response) {
    res.clearCookie('token');
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    // console.log(user, 'auth');
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password.');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Incorrect email or password.');
    }
    return user;
  }
}
