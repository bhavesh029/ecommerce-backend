/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    addToCart: jest.fn(),
    getOrCreateCart: jest.fn(),
    removeFromCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToCart', () => {
    it('should call service.addToCart', async () => {
      const dto = { productId: 1, quantity: 2, userId: 1 };
      await controller.addToCart(dto);
      expect(service.addToCart).toHaveBeenCalledWith(dto);
    });
  });

  describe('getCart', () => {
    it('should call service.getOrCreateCart with userId', async () => {
      await controller.getCart('1');
      expect(service.getOrCreateCart).toHaveBeenCalledWith(1);
    });
  });

  describe('removeFromCart', () => {
    it('should call service.removeFromCart with userId', async () => {
      await controller.removeFromCart(1, '1');
      expect(service.removeFromCart).toHaveBeenCalledWith(1, 1);
    });
  });
});
