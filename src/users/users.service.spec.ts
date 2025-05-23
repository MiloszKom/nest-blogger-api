import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UsersService } from './users.service';

describe('PostsService', () => {
  let service: UsersService;

  // Dynamic mocking

  const mockUsersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@test.com' },
        { id: 2, username: 'user2', email: 'user2@test.com' },
      ];
      mockUsersRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if email exists', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@test.com');
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should successfully create a user', async () => {
      const mockUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed123',
      };
      const savedUser = { id: 1, ...mockUser };

      mockUsersRepository.create.mockReturnValue(mockUser);
      mockUsersRepository.save.mockResolvedValue(savedUser);

      const result = await service.createUser(
        'testuser',
        'test@example.com',
        'hashed123',
      );

      expect(result).toEqual(savedUser);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(mockUser);
      expect(mockUsersRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
