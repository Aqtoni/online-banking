import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Users } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;
          if (request?.headers?.cookie) {
            const cookies = request.headers.cookie.split(';');
            const tokenCookie = cookies.find((cookie) =>
              cookie.trim().startsWith('token='),
            );
            if (tokenCookie) {
              token = tokenCookie.split('=')[1];
            }
          }
          return token;
        },
      ]),
      secretOrKey: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: { userId: number; email: string }) {
    const user = await this.usersRepository.findOne({
      where: {
        id: payload.userId,
        email: payload.email,
      },
    });
    delete user.password;
    return user;
  }
}
