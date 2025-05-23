import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(
    username: string,
    email: string,
    pass: string,
    passConfirm: string,
    res: Response,
  ) {
    if (pass !== passConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingEmailUser = await this.usersService.findByEmail(email);
    if (existingEmailUser) {
      throw new ConflictException('Email already taken');
    }

    const existingUsernameUser =
      await this.usersService.findByUsername(username);
    if (existingUsernameUser) {
      throw new ConflictException('Username already taken');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(pass, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.createUser(username, email, result);

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
  }

  async login(email: string, pass: string, res: Response) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(pass, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });
  }

  logout(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
  }
}
