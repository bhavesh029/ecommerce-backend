import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service'; // Import UsersService
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  // Mocks
  const mockCartRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockCartItemRepo = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  const mockProductsService = { findOne: jest.fn() };
  const mockUsersService = { findOne: jest.fn() }; // Mock UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useValue: mockCartRepo },
        { provide: getRepositoryToken(CartItem), useValue: mockCartItemRepo },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: UsersService, useValue: mockUsersService }, // Provide it here
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToCart', () => {
    it('should throw error if insufficient stock', async () => {
      mockProductsService.findOne.mockResolvedValue({ id: 1, quantity: 5 });

      await expect(
        service.addToCart({ productId: 1, quantity: 10, userId: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should add item if stock is available', async () => {
      mockProductsService.findOne.mockResolvedValue({ id: 1, quantity: 10 });
      mockCartRepo.findOne.mockResolvedValue({ id: 1, cartItems: [] });
      mockCartItemRepo.create.mockReturnValue({ id: 1 });
      mockCartItemRepo.save.mockResolvedValue({ id: 1 });

      await service.addToCart({ productId: 1, quantity: 2, userId: 1 });

      expect(mockCartItemRepo.create).toHaveBeenCalled();
      expect(mockCartItemRepo.save).toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    it('should remove item', async () => {
      const mockCart = {
        id: 1,
        cartItems: [{ product: { id: 1 }, quantity: 1 }],
      };
      mockCartRepo.findOne.mockResolvedValue(mockCart);
      mockCartItemRepo.remove.mockResolvedValue(undefined);

      await service.removeFromCart(1, 1);
      expect(mockCartItemRepo.remove).toHaveBeenCalled();
    });

    it('should throw error if item not in cart', async () => {
      const mockCart = { id: 1, cartItems: [] };
      mockCartRepo.findOne.mockResolvedValue(mockCart);

      await expect(service.removeFromCart(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
