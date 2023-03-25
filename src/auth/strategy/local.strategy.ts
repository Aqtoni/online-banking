import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private auth: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Users> {
    const user = await this.auth.validateUser(email, password);
    // console.log(user, 'local');
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid on local.');
    }
    return user;
  }
}
