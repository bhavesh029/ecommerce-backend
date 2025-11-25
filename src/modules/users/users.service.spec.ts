import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = {
        name: 'John',
        age: 30,
        gender: 'male',
        email: 'test@test.com',
      };
      mockUserRepo.findOneBy.mockResolvedValue(null); // No existing user
      mockUserRepo.create.mockReturnValue(dto);
      mockUserRepo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should throw ConflictException if email exists', async () => {
      mockUserRepo.findOneBy.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
      });
      await expect(
        service.create({ email: 'test@test.com' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return user if found', async () => {
      const user = { id: 1, name: 'John' };
      mockUserRepo.findOneBy.mockResolvedValue(user);
      expect(await service.findOne(1)).toEqual(user);
    });

    it('should throw NotFoundException if missing', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
