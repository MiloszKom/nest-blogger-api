import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';

describe('PostsService', () => {
  let service: PostsService;

  // Static mocking
  const mockPostsRepository = {
    create: jest.fn().mockImplementation((data) => data),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: Date.now(),
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostsRepository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and return it', async () => {
    const postTitle = 'Post Title';
    const postContent = 'Post content';
    const userId = 1;

    expect(await service.createPost(postTitle, postContent, userId)).toEqual({
      id: expect.any(Number),
      title: postTitle,
      content: postContent,
      author: { id: userId },
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
