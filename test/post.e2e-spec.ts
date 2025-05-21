import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { PostsModule } from '../src/posts/posts.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from '../src/posts/post.entity';
import { AuthGuard } from '../src/auth/auth.guard';

describe('PostController (e2e)', () => {
  let app: INestApplication<App>;

  const mockPosts = [
    { id: 1, title: 'PostTitle1', content: 'PostContent1', authorId: 1 },
    { id: 2, title: 'PostTitle2', content: 'PostContent2', authorId: 2 },
    { id: 3, title: 'PostTitle3', content: 'PostContent3', authorId: 3 },
  ];

  const mockPostsRepository = {
    find: jest.fn().mockReturnValue(mockPosts),
    findOne: jest.fn(({ where: { id } }) =>
      mockPosts.find((post) => post.id === id),
    ),
  };
  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PostsModule],
    })
      .overrideProvider(getRepositoryToken(Post))
      .useValue(mockPostsRepository)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /posts - returns all posts', () => {
    return request(app.getHttpServer()).get('/posts').expect({
      statusCode: 200,
      message: 'Posts fetched successfully',
      data: mockPosts,
    });
  });

  it('GET /posts/2 - returns a post by ID', () => {
    return request(app.getHttpServer()).get('/posts/2').expect({
      statusCode: 200,
      message: 'Post fetched successfully',
      data: mockPosts[1],
    });
  });

  it('GET /posts/99 - returns 404 when post is not found', () => {
    return request(app.getHttpServer()).get('/posts/99').expect({
      statusCode: 404,
      message: 'Post not found',
      error: 'Not Found',
    });
  });
});
