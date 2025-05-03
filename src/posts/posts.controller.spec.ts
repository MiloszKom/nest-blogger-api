import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/auth.guard';
import { CustomRequest } from 'src/auth/customRequest';

describe('PostsController', () => {
  let controller: PostsController;

  const mockPostsService = {
    createPost: jest.fn((title, content, userId) => ({
      id: Date.now(),
      title,
      content,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsService],
    })
      .overrideProvider(PostsService)
      .useValue(mockPostsService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('shoud be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post', async () => {
    const postData = {
      title: 'New Post',
      content: 'my post content',
    };

    const mockRequest = {
      user: {
        sub: 1,
      },
    } as CustomRequest;

    const result = await controller.createPost(postData, mockRequest);

    expect(result).toEqual({
      id: expect.any(Number),
      title: postData.title,
      content: postData.content,
      userId: mockRequest.user.sub,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(mockPostsService.createPost).toHaveBeenCalledWith(
      postData.title,
      postData.content,
      mockRequest.user.sub,
    );
  });

  // To Do: Test updating and deleting posts
});
