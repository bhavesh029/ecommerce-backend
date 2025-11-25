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
      const dto = { name: 'Keyboard', price: 50, inStock: true };
      mockProductRepository.create.mockReturnValue(dto);
      mockProductRepository.save.mockResolvedValue({ id: 'uuid', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 'uuid', ...dto });
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const product = { id: 'uuid', name: 'Keyboard' };
      mockProductRepository.findOneBy.mockResolvedValue(product);

      const result = await service.findOne('uuid');
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const existingProduct = { id: 'uuid', name: 'Old Name', price: 10 };
      const updateDto = { name: 'New Name' };

      mockProductRepository.findOneBy.mockResolvedValue(existingProduct);
      mockProductRepository.merge.mockReturnValue({
        ...existingProduct,
        ...updateDto,
      });
      mockProductRepository.save.mockResolvedValue({
        ...existingProduct,
        ...updateDto,
      });

      const result = await service.update('uuid', updateDto);
      expect(result.name).toEqual('New Name');
    });
  });

  describe('remove', () => {
    it('should delete the product if it exists', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('uuid');
      expect(repository.delete).toHaveBeenCalledWith('uuid');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('uuid')).rejects.toThrow(NotFoundException);
    });
  });
});
