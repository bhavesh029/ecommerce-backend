/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = { name: 'Mouse', price: 20, inStock: true };
      const result = { id: 'uuid', ...dto };

      mockProductsService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [{ id: 'uuid', name: 'Mouse', price: 20 }];
      mockProductsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = { id: 'uuid', name: 'Mouse', price: 20 };
      mockProductsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('uuid')).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { price: 25 };
      const result = { id: 'uuid', name: 'Mouse', price: 25 };
      mockProductsService.update.mockResolvedValue(result);

      expect(await controller.update('uuid', dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove('uuid');
      expect(service.remove).toHaveBeenCalledWith('uuid');
    });
  });
});
