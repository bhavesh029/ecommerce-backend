/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

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

  describe('create', () => {
    it('should successfully insert a product', async () => {
      // Added quantity
      const dto = { name: 'Keyboard', price: 50, inStock: true, quantity: 10 };
      mockProductRepository.create.mockReturnValue(dto);
      mockProductRepository.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 1, name: 'Keyboard', quantity: 10 };
      mockProductRepository.findOneBy.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);
      // Pass a number ID
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the product if it exists', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
