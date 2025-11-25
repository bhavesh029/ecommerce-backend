import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { CouponsService } from '../coupons/coupons.service';
import { UsersService } from '../users/users.service';
import { DataSource } from 'typeorm';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrderRepo = { count: jest.fn() };
  const mockCartService = {
    getOrCreateCart: jest.fn(),
    removeFromCart: jest.fn(),
  };
  const mockProductsService = { findOne: jest.fn(), update: jest.fn() };
  const mockCouponsService = { findByCode: jest.fn(), applyCoupon: jest.fn() };
  const mockUsersService = { findOne: jest.fn() };
  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest
          .fn()
          .mockImplementation((entity, data) =>
            Promise.resolve({ id: 1, ...data }),
          ),
        delete: jest.fn(),
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: CartService, useValue: mockCartService },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: CouponsService, useValue: mockCouponsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should count orders', async () => {
    mockOrderRepo.count.mockResolvedValue(10);
    expect(await service.countOrders()).toBe(10);
  });
});
