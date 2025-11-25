/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CouponsService } from './coupons.service';
import { OrdersService } from '../orders/orders.service'; // Import OrdersService
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('CouponsService', () => {
  let service: CouponsService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockConfig = {
    get: jest.fn(),
  };

  // Mock the OrdersService
  const mockOrdersService = {
    countOrders: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponsService,
        { provide: getRepositoryToken(Coupon), useValue: mockRepo },
        { provide: ConfigService, useValue: mockConfig },
        { provide: OrdersService, useValue: mockOrdersService }, // Provide the mock here
      ],
    }).compile();

    service = module.get<CouponsService>(CouponsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateNthOrderCoupon', () => {
    it('should return eligible=false if not nth order', async () => {
      // Set N = 5
      mockConfig.get.mockReturnValue(5);
      
      // Mock Order Count: 0 orders so far. Next is 1.
      // 1 % 5 != 0
      mockOrdersService.countOrders.mockResolvedValue(0);

      const result = await service.generateNthOrderCoupon();
      expect(result.eligible).toBe(false);
    });

    it('should return eligible=true if nth order', async () => {
      mockConfig.get.mockReturnValue(5);

      // Mock Order Count: 4 orders exist.
      // Next order will be the 5th. 5 % 5 == 0. Should win!
      mockOrdersService.countOrders.mockResolvedValue(4);

      mockRepo.findOneBy.mockResolvedValue(null); // No existing coupon
      mockRepo.create.mockReturnValue({ code: 'LUCKY-5' });
      mockRepo.save.mockResolvedValue({ code: 'LUCKY-5' });

      const result = await service.generateNthOrderCoupon();
      expect(result.eligible).toBe(true);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should throw error if code exists', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1 });
      await expect(
        service.create({ code: 'TEST', discountPercentage: 10 }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});