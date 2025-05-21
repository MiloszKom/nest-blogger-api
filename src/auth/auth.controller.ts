import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { LoginDto } from './dtos/login.dto';
import { SignupDto } from './dtos/signup.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register new account',
  })
  @Post('signup')
  async signup(
    @Body() body: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signup(
      body.username,
      body.email,
      body.password,
      body.passwordConfirm,
      res,
    );

    return {
      statusCode: 201,
      message: 'Signed up successfully',
    };
  }

  @ApiOperation({
    summary: 'User login',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.login(body.email, body.password, res);

    return {
      statusCode: 200,
      message: 'Logged in successfully',
    };
  }

  @ApiOperation({
    summary: 'User logout',
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res);

    return {
      statusCode: 200,
      message: 'Logged out successfully',
    };
  }
}
