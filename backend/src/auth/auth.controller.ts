import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from 'src/users/entity/users.entity';
import { CreateUser } from 'src/users/dto/create-user.dto ';
import { AuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a new user',
    type: Users,
  })
  @ApiConflictResponse({ description: 'Email already exists' })
  @ApiInternalServerErrorResponse({ description: 'Failed to create user' })
  async signup(@Body() dto: CreateUser) {
    return await this.authService.signup(dto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Log in',
    type: Users,
  })
  @ApiForbiddenResponse({ description: 'Incorrect email or password' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }
}
