import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { UsersModule } from '../src/users/users.module';
import { App } from 'supertest/types';
import * as request from 'supertest';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;

  const mockUsers = [
    {
      id: 1,
      username: 'user1',
      email: 'user@mail1.com',
    },
    {
      id: 2,
      username: 'user2',
      email: 'user@mail2.com',
    },
    {
      id: 3,
      username: 'user3',
      email: 'user@mail3.com',
    },
  ];

  const mockUsersRepository = {
    find: jest.fn().mockReturnValue(mockUsers),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /users - returns all users', () => {
    return request(app.getHttpServer()).get('/users').expect({
      statusCode: 200,
      message: 'Users fetched successfully',
      data: mockUsers,
    });
  });
});
