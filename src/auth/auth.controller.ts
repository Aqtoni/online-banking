import {
  Body,
  Controller,
  Get,
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
import { CurrentUser } from './decorator/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new user',
    type: RegisterDto,
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
    type: LoginDto,
  })
  @ApiForbiddenResponse({ description: 'Incorrect email or password' })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@CurrentUser() user: Users, @Res() res: Response) {
    await this.authService.logout(user, res);
    res.send();
  }
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get information about user',
    type: Users,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: Users) {
    console.log(user);
    return user;
  }
}
