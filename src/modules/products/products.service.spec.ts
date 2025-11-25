import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  // 1. Mock the TypeORM Repository
  const mockProductRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- TEST: CREATE ---
  describe('create', () => {
    it('should successfully insert a product', async () => {
      const dto = { name: 'Keyboard', price: 50, inStock: true };
      mockProductRepository.create.mockReturnValue(dto);
      mockProductRepository.save.mockResolvedValue({ id: 'uuid', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 'uuid', ...dto });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  // --- TEST: FIND ONE (Success & Failure) ---
  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 'uuid', name: 'Keyboard' };
      mockProductRepository.findOneBy.mockResolvedValue(product);

      const result = await service.findOne('uuid');
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null); // Simulate DB returning nothing

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  // --- TEST: UPDATE ---
  describe('update', () => {
    it('should update and return the product', async () => {
      const existingProduct = { id: 'uuid', name: 'Old Name', price: 10 };
      const updateDto = { name: 'New Name' };
      
      // 1. Mock finding the existing product
      mockProductRepository.findOneBy.mockResolvedValue(existingProduct);
      // 2. Mock merging the data
      mockProductRepository.merge.mockReturnValue({ ...existingProduct, ...updateDto });
      // 3. Mock saving the result
      mockProductRepository.save.mockResolvedValue({ ...existingProduct, ...updateDto });

      const result = await service.update('uuid', updateDto);
      expect(result.name).toEqual('New Name');
    });
  });

  // --- TEST: DELETE ---
  describe('remove', () => {
    it('should delete the product if it exists', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 }); // Simulate 1 row deleted

      await service.remove('uuid');
      expect(repository.delete).toHaveBeenCalledWith('uuid');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 }); // Simulate 0 rows deleted

      await expect(service.remove('uuid')).rejects.toThrow(NotFoundException);
    });
  });
});