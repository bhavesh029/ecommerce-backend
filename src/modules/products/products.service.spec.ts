import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  // 1. Create a "Fake" Repository
  // We mock the DB functions so we don't need a real Postgres connection for this test
  const mockProductRepository = {
    find: jest.fn().mockResolvedValue(['test-product']),
    create: jest.fn().mockReturnValue('new-product'),
    save: jest.fn().mockResolvedValue('new-product'),
    findOneBy: jest.fn().mockResolvedValue('single-product'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        // 2. Inject the Fake Repository instead of the real TypeORM one
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  // Test Case 1: Does the service compile?
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test Case 2: Does findAll() return data?
//   it('should return an array of products', async () => {
//     const result = await service.findAll();
//     expect(result).toEqual(['test-product']); // Check if it returns our mock data
//     expect(mockProductRepository.find).toHaveBeenCalled(); // Check if it called the repo
//   });
});