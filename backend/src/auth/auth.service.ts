import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsException } from 'src/filters/already-exists';
import { CreateUser } from 'src/users/dto/create-user.dto ';
import { Users } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: CreateUser) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.usersRepository.save({
        ...dto,
        hash: hash,
      });

      return await this.signToken(user.id, user.email);
    } catch (error) {
      if (error.code === '23505') {
        throw new AlreadyExistsException('Email with this name already exists');
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Incorrect email or password');

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) throw new ForbiddenException('Incorrect email or password');

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };

    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
