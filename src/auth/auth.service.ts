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
      const { accessToken, refreshToken } = await this.createTokenPair(
        user.id,
        user.email,
      );
      const cookie = await this.getCookieWithTokenPair(
        accessToken,
        refreshToken,
      );
      res.setHeader('Set-Cookie', cookie);
    } catch (error) {
      if (error.code === '23505') {
        throw new AlreadyExistsException('Email with this name already exists');
      }
      throw error;
    }
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.validateUser(dto.email, dto.password);
    const { accessToken, refreshToken } = await this.createTokenPair(
      user.id,
      user.email,
    );
    const cookie = await this.getCookieWithTokenPair(accessToken, refreshToken);
    res.setHeader('Set-Cookie', cookie);
    res.send();
  }

  async logout(user: Users, res: Response) {
    // Better this than that res.clearCookie
    await this.removeRefreshToken(user.id);
    res.setHeader('Set-Cookie', await this.getCookiesForLogOut());
    res.send();
  }

  async validateUser(email: string, password: string): Promise<Users> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async createTokenPair(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenPayload: TokenPayload = { userId, email };
    const refreshTokenPayload: TokenPayload = { userId, email };
    const accessToken = this.jwt.sign(accessTokenPayload, {
      secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    const refreshToken = this.jwt.sign(refreshTokenPayload, {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    const currentHashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
    this.updateRefreshToken(userId, currentHashedRefreshToken);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, currentHashedRefreshToken: string) {
    await this.usersRepository.update(
      { id: userId },
      { currentHashedRefreshToken },
    );
  }

  async removeRefreshToken(userId: number) {
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: number,
  ): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getCookieWithTokenPair(
    accessToken: string,
    refreshToken: string,
  ): Promise<string[]> {
    return [
      `${this.config.get(
        'AUTH_COOKIE_NAME',
      )}=${accessToken}; HttpOnly; Path=/; Max-Age=${this.config.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}; secure=true; SameSite=strict;`,
      `${this.config.get(
        'REFRESH_COOKIE_NAME',
      )}=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.config.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}; secure=true; SameSite=strict;`,
    ];
  }

  async getCookiesForLogOut(): Promise<string[]> {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
