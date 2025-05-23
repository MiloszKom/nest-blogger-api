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

  describe('POST /auth/login', () => {
    it('should log the user in with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'user@mail1.com',
          password: 'HashedPassword',
        })
        .expect(200)
        .expect({
          statusCode: 200,
          message: 'Logged in successfully',
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@mail.com',
          password: 'wrong_password',
        })
        .expect(401)
        .expect({
          message: 'Email or password is incorrect',
          error: 'Unauthorized',
          statusCode: 401,
        });
    });
  });

  describe('POST /auth/signup', () => {
    it('should sign up a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'newuser',
          email: 'new@mail.com',
          password: 'valid_password',
          passwordConfirm: 'valid_password',
        })
        .expect(201)
        .expect({
          statusCode: 201,
          message: 'Signed up successfully',
        });
    });

    it('should return 400 if passwords do not match', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'user2',
          email: 'user2@mail.com',
          password: 'password123',
          passwordConfirm: 'different_password',
        })
        .expect(400)
        .expect({
          message: 'Passwords do not match',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 409 if email is already taken', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'user2',
          email: 'user@mail1.com',
          password: 'password',
          passwordConfirm: 'password',
        })
        .expect(409)
        .expect({
          message: 'Email already taken',
          error: 'Conflict',
          statusCode: 409,
        });
    });

    it('should return 409 if username is already taken', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'user1',
          email: 'unique@mail.com',
          password: 'password',
          passwordConfirm: 'password',
        })
        .expect(409)
        .expect({
          message: 'Username already taken',
          error: 'Conflict',
          statusCode: 409,
        });
    });
  });
});
