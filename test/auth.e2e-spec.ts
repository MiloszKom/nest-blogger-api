import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthGuard } from '../src/auth/auth.guard';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUsers = [
    {
      id: 1,
      username: 'user1',
      email: 'user@mail1.com',
      password:
        '18ad03432984233b.3101fe472b4e66b7e16a6fde200100a97c813d88e3037eed243b5c5c1670ba81',
    },
  ];

  const mockUsersRepository = {
    findOne: jest.fn().mockImplementation(({ where: { email } }) => {
      const user = mockUsers.find((user) => user.email === email);
      return Promise.resolve(user);
    }),
    create: jest.fn().mockImplementation((userData) => {
      const newId = mockUsers.length + 1;
      const newUser = { ...userData, id: newId };
      mockUsers.push(newUser);
      return Promise.resolve(newUser);
    }),
    save: jest.fn().mockImplementation((user) => {
      const index = mockUsers.findIndex((u) => u.id === user.id);
      if (index >= 0) {
        mockUsers[index] = user;
        return Promise.resolve(user);
      }
      const newId = mockUsers.length + 1;
      const newUser = { ...user, id: newId };
      mockUsers.push(newUser);
      return Promise.resolve(newUser);
    }),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/login - Logs the user in', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@mail1.com',
        password: 'HashedPassword',
      })
      .expect({
        statusCode: 200,
        message: 'Logged in successfully',
      });
  });

  it('POST /auth/login - Returns 401 Unauthrorized when the user provides wrong login credentails', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'wrong@mail.com',
        password: 'PasswordAlsoWrong',
      })
      .expect({
        message: 'Email or password is incorrect',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('POST /auth/signup - Signs up the user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'user2',
        email: 'user@mail2.com',
        password: 'HashedPassword2',
        passwordConfirm: 'HashedPassword2',
      })
      .expect({
        statusCode: 201,
        message: 'Signed up successfully',
      });
  });

  it('POST /auth/signup - Returns 400 Bad Request when password and confirmation do not matchs', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'user2',
        email: 'user@mail2.com',
        password: 'HashedPassword2',
        passwordConfirm: 'SomeDiffrientPassoword',
      })
      .expect({
        message: 'Passwords do not match',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('POST /auth/signup - Returns 409 Conflict when email already existss', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'user3',
        email: 'user@mail2.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect({
        message: 'Email already taken',
        error: 'Conflict',
        statusCode: 409,
      });
  });

  it('POST /auth/signup - Returns 409 Conflict when username already existss', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'user2',
        email: 'user@mail3.com',
        password: 'password',
        passwordConfirm: 'password',
      })
      .expect({
        message: 'Username already taken',
        error: 'Conflict',
        statusCode: 409,
      });
  });
});
