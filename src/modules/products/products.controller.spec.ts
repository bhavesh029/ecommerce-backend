/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      // Added quantity
      const dto: CreateProductDto = {
        name: 'Mouse',
        price: 20,
        inStock: true,
        quantity: 100,
      };
      const result = { id: 1, ...dto }; // ID is now a number

      mockProductsService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [{ id: 1, name: 'Mouse', price: 20, quantity: 100 }];
      mockProductsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = { id: 1, name: 'Mouse', price: 20, quantity: 100 };
      mockProductsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result); // Pass number 1
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
