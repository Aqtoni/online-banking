import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from 'src/users/entity/users.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/logIn.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';
import JwtAuthGuard from './guard/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new user',
    type: Users,
  })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create user' })
  async signup(@Body() dto: RegisterDto, @Res() res: Response) {
    await this.authService.signup(dto, res);
    res.send();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log in',
    type: Users,
  })
  @ApiForbiddenResponse({ description: 'Incorrect email or password' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    await this.authService.login(dto, res);
    res.send();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log out',
    type: Users,
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    await this.authService.logout(res);
    res.send();
  }
}
